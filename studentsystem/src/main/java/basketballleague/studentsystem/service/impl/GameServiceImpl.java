package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.GameRepository;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private PlayerRepository playerRepository; // Assuming you have a repository to fetch players

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

        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);
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
    public List<Game> getFinishedGames() {
        return gameRepository.findByStatus(Game.GameStatus.FINISHED);
    }
}
