package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.repository.GameRepository;
import basketballleague.studentsystem.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
                           @RequestParam String location,@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date
    ) {
        return gameService.createGame(teamAname, teamBname, location,date);
    }

    @PostMapping("/simulate/{id}")
    public void simulateGame(@PathVariable int id) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        gameService.simulateGame(game);
    }
    @GetMapping("/history")
    public List<Game> getFinishedGames() {
        return gameService.getFinishedGames();
    }
}