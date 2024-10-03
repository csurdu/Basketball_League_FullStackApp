package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dto.GameDTO;
import basketballleague.studentsystem.dto.GameDetailsDTO;
import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.repository.GameRepository;
import basketballleague.studentsystem.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/games")
public class GameController {
    @Autowired
    private final GameService gameService;

    @Autowired
    private final GameRepository gameRepository;

    public GameController(GameService gameService, GameRepository gameRepository) {
        this.gameService = gameService;
        this.gameRepository = gameRepository;
    }

    @PostMapping("/create")
    public Game createGame(@RequestParam String teamAname, @RequestParam String teamBname,
                           @RequestParam String location, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return gameService.createGame(teamAname, teamBname, location, date);
    }

    @PostMapping("/simulate/{id}")
    public void simulateGame(@PathVariable int id) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        gameService.simulateGame(game);
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<GameDetailsDTO> getGameDetails(@PathVariable int gameId) {
        GameDetailsDTO gameDetails = gameService.getGameDetails(gameId);
        return ResponseEntity.ok(gameDetails);
    }

    @GetMapping("/history")
    public List<GameDTO> getFinishedGames() {
        return gameService.getFinishedGames();
    }

    @PostMapping("/simulateTournament")
    public void simulateTournament(
            @RequestParam String team1,
            @RequestParam String team2,
            @RequestParam String team3,
            @RequestParam String team4) {
        List<String> teamNames = Arrays.asList(team1, team2, team3, team4);
      gameService.simulateTournament(teamNames);

    }
    @GetMapping("/scheduled")
    public List<GameDTO> getScheduledGames() {
        return gameService.getGamesByStatus(Game.GameStatus.SCHEDULED);
    }



}
