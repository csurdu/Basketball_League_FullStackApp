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

import java.time.LocalDate;
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

        LocalDate gameDate = date.toLocalDate();

        boolean gameExists = gameRepository.existsByTeamAAndTeamBAndDateBetween(teamA, teamB, gameDate.atStartOfDay(), gameDate.plusDays(1).atStartOfDay());

        if (gameExists) {
            throw new IllegalArgumentException("A game between the same teams is already scheduled for the same day.");
        }

        Game game = new Game();
        game.setTeamA(teamA);
        game.setTeamB(teamB);
        game.setLocation(location);
        game.setDate(date);
        game.setStatus(Game.GameStatus.SCHEDULED);
        return gameRepository.save(game);
    }

    @Override
    public void simulateGame(Game game) {
        resetPlayerStats(game);

        game.setStatus(Game.GameStatus.IN_PROGRESS);
        gameRepository.save(game);
        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);

        long startTime = System.currentTimeMillis();
        long gameDuration = 10000; // 10 seconds

        while (System.currentTimeMillis() - startTime < gameDuration) {
            boolean updateTeamA = random.nextBoolean();

            Player player = updateTeamA ? selectScoringPlayer(game.getTeamA()) : selectScoringPlayer(game.getTeamB());
            int pointsType = random.nextInt(3) + 1; // 1, 2, or 3 points

            int scoreChange = pointsType == 1 ? 1 : (pointsType == 2 ? 2 : 3);
            int attemptsChange = scoreChange > 0 ? random.nextInt(2) + 1 : random.nextInt(2); // 0 or 1 if no score, 1 or 2 if scored

            int reboundsChange = random.nextInt(2);  // 0 or 1 rebound
            int stealsChange = random.nextInt(2);  // 0 or 1 steal
            int assistsChange = random.nextInt(2);  // 0 or 1 assist

            if (updateTeamA) {
                game.setScoreTeamA(game.getScoreTeamA() + scoreChange);
            } else {
                game.setScoreTeamB(game.getScoreTeamB() + scoreChange);
            }

            updatePlayerInGameStats(player, scoreChange, pointsType, attemptsChange, reboundsChange, stealsChange, assistsChange);
            messagingTemplate.convertAndSend("/topic/playerUpdate/" + player.getId(), player);

            GameEvent event = new GameEvent();
            event.setGame(game);
            event.setEventType("SCORE");
            event.setDescription(player.getFirstName() + " scored " + scoreChange + " points.");
            event.setTimestamp(LocalDateTime.now());
            gameEventRepository.save(event);

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

    private Player selectScoringPlayer(Team team) {
        List<Player> players = playerRepository.findByTeam(team);

        double totalWeight = players.stream().mapToDouble(this::calculatePlayerWeight).sum();
        if (totalWeight == 0) {
            return players.get(random.nextInt(players.size())); // Fallback in case all weights are 0
        }

        double randomValue = random.nextDouble() * totalWeight;
        for (Player player : players) {
            randomValue -= calculatePlayerWeight(player);
            if (randomValue <= 0) {
                return player;
            }
        }
        return players.get(players.size() - 1); // Fallback in case of rounding issues
    }

    private double calculatePlayerWeight(Player player) {
        double pointsPerGameWeight = player.getPointsPerGame();
        double onePointPercentage = player.getOnePointPercentage();
        double twoPointPercentage = player.getTwoPointPercentage();
        double threePointPercentage = player.getThreePointPercentage();

        double scoringPercentageWeight = 0;
        int scoringAttempts = 0;

        if (onePointPercentage > 0) {
            scoringPercentageWeight += onePointPercentage;
            scoringAttempts++;
        }
        if (twoPointPercentage > 0) {
            scoringPercentageWeight += twoPointPercentage;
            scoringAttempts++;
        }
        if (threePointPercentage > 0) {
            scoringPercentageWeight += threePointPercentage;
            scoringAttempts++;
        }

        if (scoringAttempts > 0) {
            scoringPercentageWeight /= scoringAttempts;
        }

        // Avoid players with all stats 0 from having a high weight
        double baseWeight = 1.0; // Base weight to avoid complete exclusion
        double experienceFactor = player.getGamesPlayed() > 0 ? 1.0 : 0.1; // Reduce weight if the player has no experience

        double heightFactor = 0;
        try {
            heightFactor = Double.parseDouble(player.getHeight()) / 100.0;
        } catch (NumberFormatException e) {
            // Handle the case where height is not a valid number
            heightFactor = 0; // Default to 0 if parsing fails
        }

        double totalWeight = baseWeight + (pointsPerGameWeight + scoringPercentageWeight + heightFactor) * experienceFactor;

        return totalWeight;
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
