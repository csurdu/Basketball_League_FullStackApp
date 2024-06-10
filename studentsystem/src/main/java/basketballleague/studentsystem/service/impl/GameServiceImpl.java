package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.dto.*;
import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.model.GameEvent;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.GameEventRespository;
import basketballleague.studentsystem.repository.GameRepository;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.GameService;
import basketballleague.studentsystem.tournament.Bracket;
import basketballleague.studentsystem.tournament.Match;
import basketballleague.studentsystem.tournament.TournamentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private GameEventRespository gameEventRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Random random = new Random();

    @Override
    public Game createGame(String teamAname, String teamBname, String location, LocalDateTime date) {
        Team teamA = teamRepository.findByName(teamAname).orElseThrow(() -> new IllegalArgumentException("Team A not found"));
        Team teamB = teamRepository.findByName(teamBname).orElseThrow(() -> new IllegalArgumentException("Team B not found"));

        Game game = new Game();
        game.setTeamA(teamA);
        game.setTeamB(teamB);
        game.setLocation(location);
        game.setDate(date);  // Set the date here
        game.setStatus(Game.GameStatus.SCHEDULED);
        return gameRepository.save(game);
    }

    @Override
    public void simulateGame(Game game) {
        resetPlayerStats(game);

        game.setStatus(Game.GameStatus.IN_PROGRESS);
        gameRepository.save(game);
        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);

        int totalUpdates = 10; // number of updates during the game
        for (int i = 0; i < totalUpdates; i++) {
            // Select a random player from each team
            Player playerA = getRandomPlayer(game.getTeamA());
            Player playerB = getRandomPlayer(game.getTeamB());

            // Simulate score changes and attempts
            int pointsTypeA = random.nextInt(3) + 1; // 1, 2, or 3 points
            int pointsTypeB = random.nextInt(3) + 1;

            int scoreChangeA = pointsTypeA == 1 ? 1 : (pointsTypeA == 2 ? 2 : 3);
            int scoreChangeB = pointsTypeB == 1 ? 1 : (pointsTypeB == 2 ? 2 : 3);

            int attemptsChangeA = scoreChangeA > 0 ? random.nextInt(2) + 1 : random.nextInt(2); // 0 or 1 if no score, 1 or 2 if scored
            int attemptsChangeB = scoreChangeB > 0 ? random.nextInt(2) + 1 : random.nextInt(2); // 0 or 1 if no score, 1 or 2 if scored

            int reboundsChangeA = random.nextInt(2);  // 0 or 1 rebound
            int reboundsChangeB = random.nextInt(2);  // 0 or 1 rebound
            int stealsChangeA = random.nextInt(2);  // 0 or 1 steal
            int stealsChangeB = random.nextInt(2);  // 0 or 1 steal
            int assistsChangeA = random.nextInt(2);  // 0 or 1 assist
            int assistsChangeB = random.nextInt(2);  // 0 or 1 assist

            game.setScoreTeamA(game.getScoreTeamA() + scoreChangeA);
            game.setScoreTeamB(game.getScoreTeamB() + scoreChangeB);

            // Update player stats
            updatePlayerInGameStats(playerA, scoreChangeA, pointsTypeA, attemptsChangeA, reboundsChangeA, stealsChangeA, assistsChangeA);
            messagingTemplate.convertAndSend("/topic/playerUpdate/" + playerA.getId(), playerA);

            updatePlayerInGameStats(playerB, scoreChangeB, pointsTypeB, attemptsChangeB, reboundsChangeB, stealsChangeB, assistsChangeB);
            messagingTemplate.convertAndSend("/topic/playerUpdate/" + playerB.getId(), playerB);

            // Save game event
            GameEvent eventA = new GameEvent();
            eventA.setGame(game);
            eventA.setEventType("SCORE");
            eventA.setDescription(playerA.getFirstName() + " scored " + scoreChangeA + " points.");
            eventA.setTimestamp(LocalDateTime.now());
            gameEventRepository.save(eventA);

            GameEvent eventB = new GameEvent();
            eventB.setGame(game);
            eventB.setEventType("SCORE");
            eventB.setDescription(playerB.getFirstName() + " scored " + scoreChangeB + " points.");
            eventB.setTimestamp(LocalDateTime.now());
            gameEventRepository.save(eventB);
            try {
                Thread.sleep(1000); // Sleep for 1 second
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            gameRepository.save(game);
            messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);
        }

        game.setStatus(Game.GameStatus.FINISHED);
        gameRepository.save(game);
        // Update points per game, rebounds per game, steals per game, assists per game, and scoring percentage
        updatePlayerStatsAfterGame(game.getTeamA().getPlayerList());
        updatePlayerStatsAfterGame(game.getTeamB().getPlayerList());
        if (game.getScoreTeamA() > game.getScoreTeamB()) {
            game.getTeamA().setGamesWon(game.getTeamA().getGamesWon() + 1);
            game.getTeamB().setGamesLost(game.getTeamB().getGamesLost() + 1);
        } else {
            game.getTeamA().setGamesLost(game.getTeamA().getGamesLost() + 1);
            game.getTeamB().setGamesWon(game.getTeamB().getGamesWon() + 1);
        }
        teamRepository.save(game.getTeamA());
        teamRepository.save(game.getTeamB());
        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);
    }

    @Override
    public GameDetailsDTO getGameDetails(int gameId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new IllegalArgumentException("Game not found"));
        return convertToGameDetailsDTO(game);
    }

    private GameDetailsDTO convertToGameDetailsDTO(Game game) {
        GameDetailsDTO gameDetailsDTO = new GameDetailsDTO();

        gameDetailsDTO.setId(game.getId());
        gameDetailsDTO.setDate(game.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        gameDetailsDTO.setLocation(game.getLocation());
        gameDetailsDTO.setStatus(game.getStatus().name());

        gameDetailsDTO.setTeamA(convertToTeamDTO(game.getTeamA()));
        gameDetailsDTO.setTeamB(convertToTeamDTO(game.getTeamB()));

        gameDetailsDTO.setScoreTeamA(game.getScoreTeamA());
        gameDetailsDTO.setScoreTeamB(game.getScoreTeamB());

        List<PlayerStatsDTO> teamAPlayerStats = game.getTeamA().getPlayerList().stream()
                .map(this::convertToPlayerStatsDTO)
                .collect(Collectors.toList());
        List<PlayerStatsDTO> teamBPlayerStats = game.getTeamB().getPlayerList().stream()
                .map(this::convertToPlayerStatsDTO)
                .collect(Collectors.toList());

        gameDetailsDTO.setTeamAPlayerStats(teamAPlayerStats);
        gameDetailsDTO.setTeamBPlayerStats(teamBPlayerStats);

        // Fetch game events and convert to DTOs
        List<GameEventDTO> eventDTOs = gameEventRepository.findByGameOrderByTimestampAsc(game).stream()
                .map(this::convertToGameEventDTO)
                .collect(Collectors.toList());
        gameDetailsDTO.setEvents(eventDTOs);

        return gameDetailsDTO;
    }

    private PlayerStatsDTO convertToPlayerStatsDTO(Player player) {
        PlayerStatsDTO playerStatsDTO = new PlayerStatsDTO();
        playerStatsDTO.setPlayerId((long) player.getId());
        playerStatsDTO.setName(player.getFirstName());
        playerStatsDTO.setPoints(player.getInGamePoints());
        playerStatsDTO.setOnePointAttempts(player.getInGame1PointAttempts());
        playerStatsDTO.setOnePointMade(player.getInGame1PointMade());
        playerStatsDTO.setTwoPointAttempts(player.getInGame2PointAttempts());
        playerStatsDTO.setTwoPointMade(player.getInGame2PointMade());
        playerStatsDTO.setThreePointAttempts(player.getInGame3PointAttempts());
        playerStatsDTO.setThreePointMade(player.getInGame3PointMade());
        playerStatsDTO.setRebounds(player.getInGameRebounds());
        playerStatsDTO.setSteals(player.getInGameSteals());
        playerStatsDTO.setAssists(player.getInGameAssists());
        return playerStatsDTO;
    }

    private GameEventDTO convertToGameEventDTO(GameEvent event) {
        GameEventDTO eventDTO = new GameEventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setEventType(event.getEventType());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setTimestamp(event.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return eventDTO;
    }

    private void updatePlayerInGameStats(Player player, int scoreChange, int pointsType, int attemptsChange, int reboundsChange, int stealsChange, int assistsChange) {
        player.setInGamePoints(player.getInGamePoints() + scoreChange);

        if (pointsType == 1) {
            player.setInGame1PointAttempts(player.getInGame1PointAttempts() + attemptsChange);
            player.setInGame1PointMade(player.getInGame1PointMade() + (scoreChange > 0 ? 1 : 0));
        } else if (pointsType == 2) {
            player.setInGame2PointAttempts(player.getInGame2PointAttempts() + attemptsChange);
            player.setInGame2PointMade(player.getInGame2PointMade() + (scoreChange > 0 ? 1 : 0));
        } else if (pointsType == 3) {
            player.setInGame3PointAttempts(player.getInGame3PointAttempts() + attemptsChange);
            player.setInGame3PointMade(player.getInGame3PointMade() + (scoreChange > 0 ? 1 : 0));
        }

        player.setInGameRebounds(player.getInGameRebounds() + reboundsChange);
        player.setInGameSteals(player.getInGameSteals() + stealsChange);
        player.setInGameAssists(player.getInGameAssists() + assistsChange);
        playerRepository.save(player);
    }

    private void resetPlayerStats(Game game) {
        game.getTeamA().getPlayerList().forEach(player -> {
            player.setInGamePoints(0);
            player.setInGame1PointAttempts(0);
            player.setInGame2PointAttempts(0);
            player.setInGame3PointAttempts(0);
            player.setInGame1PointMade(0);
            player.setInGame2PointMade(0);
            player.setInGame3PointMade(0);
            player.setInGameRebounds(0);
            player.setInGameSteals(0);
            player.setInGameAssists(0);
            playerRepository.save(player);
        });
        game.getTeamB().getPlayerList().forEach(player -> {
            player.setInGamePoints(0);
            player.setInGame1PointAttempts(0);
            player.setInGame2PointAttempts(0);
            player.setInGame3PointAttempts(0);
            player.setInGame1PointMade(0);
            player.setInGame2PointMade(0);
            player.setInGame3PointMade(0);
            player.setInGameRebounds(0);
            player.setInGameSteals(0);
            player.setInGameAssists(0);
            playerRepository.save(player);
        });
    }

    private void updatePlayerStatsAfterGame(Set<Player> players) {
        players.forEach(player -> {
            player.updateGamesPlayed();
            updatePointsPerGame(player);
            updateReboundsPerGame(player);
            updateStealsPerGame(player);
            updateAssistsPerGame(player);
            updateScoringPercentages(player);
        });
    }

    private Player getRandomPlayer(Team team) {
        List<Player> players = playerRepository.findByTeam(team);
        return players.get(random.nextInt(players.size()));
    }

    private void updatePointsPerGame(Player player) {
        player.setPointsPerGame((player.getPointsPerGame() * (player.getGamesPlayed() - 1) + player.getInGamePoints()) / player.getGamesPlayed());
        playerRepository.save(player);
    }

    private void updateReboundsPerGame(Player player) {
        float totalRebounds = player.getReboundsPerGame() * (player.getGamesPlayed() - 1) + player.getInGameRebounds();
        player.setReboundsPerGame((totalRebounds / player.getGamesPlayed()));
        playerRepository.save(player);
    }

    private void updateStealsPerGame(Player player) {
        float totalSteals = player.getStealsPerGame() * (player.getGamesPlayed() - 1) + player.getInGameSteals();
        player.setStealsPerGame((totalSteals / player.getGamesPlayed()));
        playerRepository.save(player);
    }

    private void updateAssistsPerGame(Player player) {
        float totalAssists = player.getAssistsPerGame() * (player.getGamesPlayed() - 1) + player.getInGameAssists();
        player.setAssistsPerGame((totalAssists / player.getGamesPlayed()));
        playerRepository.save(player);
    }

    private void updateScoringPercentages(Player player) {
        player.updateScoringPercentages();
        playerRepository.save(player);
    }

    @Override
    public List<GameDTO> getFinishedGames() {
        // Fetch all games with status FINISHED
        List<Game> finishedGames = gameRepository.findByStatus(Game.GameStatus.FINISHED);

        // Map each game to its corresponding GameDTO
        return finishedGames.stream().map(this::convertToGameDTO).collect(Collectors.toList());
    }

    private GameDTO convertToGameDTO(Game game) {
        GameDTO gameDTO = new GameDTO();

        // Get team names
        Team teamA = teamRepository.findById(game.getTeamA().getId()).orElse(null);
        Team teamB = teamRepository.findById(game.getTeamB().getId()).orElse(null);

        if (teamA != null) {
            gameDTO.setTeam1Name(teamA.getName());
        }
        if (teamB != null) {
            gameDTO.setTeam2Name(teamB.getName());


        }
        gameDTO.setId(game.getId());
        gameDTO.setLocation(game.getLocation());
        // Format date and hour
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        gameDTO.setDate(game.getDate().format(dateFormatter));
        gameDTO.setHour(game.getDate().getHour());

        // Set combined score or individual scores as needed
        gameDTO.setScoreA(game.getScoreTeamA());
        gameDTO.setScoreB(game.getScoreTeamB());

        return gameDTO;
    }

    private TeamDTO convertToTeamDTO(Team team) {
        if (team == null) return null;
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId(team.getId());
        teamDTO.setName(team.getName());
        return teamDTO;
    }
    @Override
    public void simulateTournament(List<String> teamNames) {
        if (teamNames.size() != 4) {
            throw new IllegalArgumentException("Tournament requires exactly 4 teams.");
        }

        // Fetch teams
        Team teamA = teamRepository.findByName(teamNames.get(0)).orElseThrow(() -> new IllegalArgumentException("Team A not found"));
        Team teamB = teamRepository.findByName(teamNames.get(1)).orElseThrow(() -> new IllegalArgumentException("Team B not found"));
        Team teamC = teamRepository.findByName(teamNames.get(2)).orElseThrow(() -> new IllegalArgumentException("Team C not found"));
        Team teamD = teamRepository.findByName(teamNames.get(3)).orElseThrow(() -> new IllegalArgumentException("Team D not found"));

        // Create and simulate first two matches
        Game semiFinal1 = createGame(teamA.getName(), teamB.getName(), "Semi-Final 1", LocalDateTime.now().plusMinutes(1));
        Game semiFinal2 = createGame(teamC.getName(), teamD.getName(), "Semi-Final 2", LocalDateTime.now().plusMinutes(2));

        simulateGame(semiFinal1);
        try {
            Thread.sleep(15000); // Sleep for 15 seconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        simulateGame(semiFinal2);
        try {
            Thread.sleep(15000); // Sleep for 15 seconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Determine winners
        Team winnerSemiFinal1 = semiFinal1.getScoreTeamA() > semiFinal1.getScoreTeamB() ? semiFinal1.getTeamA() : semiFinal1.getTeamB();
        Team winnerSemiFinal2 = semiFinal2.getScoreTeamA() > semiFinal2.getScoreTeamB() ? semiFinal2.getTeamA() : semiFinal2.getTeamB();

        // Create and simulate final match
        Game finalMatch = createGame(winnerSemiFinal1.getName(), winnerSemiFinal2.getName(), "Final", LocalDateTime.now().plusMinutes(3));
        simulateGame(finalMatch);


    }
    public List<GameDTO> getGamesByStatus(Game.GameStatus status) {
        List<Game> games = gameRepository.findByStatus(status);
        return games.stream().map(this::convertToGameDTO).collect(Collectors.toList());
    }




}
