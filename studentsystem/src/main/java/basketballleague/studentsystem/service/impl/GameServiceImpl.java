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

    @Override
    public Game createGame(String teamAname, String teamBname, String location) {
        Team teamA = teamRepository.findByName(teamAname).orElseThrow(() -> new IllegalArgumentException("Team A not found"));
        Team teamB = teamRepository.findByName(teamBname).orElseThrow(() -> new IllegalArgumentException("Team B not found"));

        Game game = new Game();
        game.setTeamA(teamA);
        game.setTeamB(teamB);
        game.setLocation(location);
        game.setStatus(Game.GameStatus.SCHEDULED);
        return gameRepository.save(game);
    }

    private final Random random = new Random();

    @Override
    public void simulateGame(Game game) {
        game.setStatus(Game.GameStatus.IN_PROGRESS);
        gameRepository.save(game);
        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);

        int totalUpdates = 10; // number of updates during the game
        for (int i = 0; i < totalUpdates; i++) {
            // Select a random player from each team
            Player playerA = getRandomPlayer(game.getTeamA());
            Player playerB = getRandomPlayer(game.getTeamB());

            // Simulate score changes
            int scoreChangeA = random.nextInt(3);  // 0, 1, or 2 points
            int scoreChangeB = random.nextInt(3);

            game.setScoreTeamA(game.getScoreTeamA() + scoreChangeA);
            game.setScoreTeamB(game.getScoreTeamB() + scoreChangeB);

            // Update player scores
            updatePlayerScore(playerA, scoreChangeA);
            messagingTemplate.convertAndSend("/topic/playerUpdate/" + playerA.getId(), playerA);

            updatePlayerScore(playerB, scoreChangeB);
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
        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);
    }


    private Player getRandomPlayer(Team team) {
        List<Player> players = playerRepository.findByTeam(team);
        return players.get(random.nextInt(players.size()));
    }

    private void updatePlayerScore(Player player, int scoreChange) {
        player.setInGamePoints(player.getInGamePoints() + scoreChange);
        playerRepository.save(player);
    }



}