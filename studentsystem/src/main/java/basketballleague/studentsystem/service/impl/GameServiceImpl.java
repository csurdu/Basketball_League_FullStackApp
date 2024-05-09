package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.GameRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private TeamRepository teamRepository;

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

        // Simulating the game dynamics over a period (e.g., each second)
        int totalUpdates = 10; // number of updates during the game
        for (int i = 0; i < totalUpdates; i++) {
            // Simulate score changes
            int scoreChangeA = random.nextInt(3);  // 0, 1, or 2 points
            int scoreChangeB = random.nextInt(3);
            game.setScoreTeamA(game.getScoreTeamA() + scoreChangeA);
            game.setScoreTeamB(game.getScoreTeamB() + scoreChangeB);

            // Artificial delay to mimic real-time updates
            try {
                Thread.sleep(1000); // Sleep for 1 second
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            // Update game state in the repository and notify clients
            gameRepository.save(game);
            messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);
        }

        // After finishing the simulation
        game.setStatus(Game.GameStatus.FINISHED);
        gameRepository.save(game);
        messagingTemplate.convertAndSend("/topic/gameplay/" + game.getId(), game);
    }



}
