package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin("*")
@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/add")
    public Game addGame(@RequestBody Game game) {
        return gameService.addGame(game);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteGame(@PathVariable int id) {
        gameService.deleteGame(id);
    }
    @DeleteMapping("/delete/all")
    public void deleteAll() {
        gameService.deleteAll();
    }

    @GetMapping("/get/{id}")
    public Optional<Game> getGameById(@PathVariable int id) {
        return gameService.getGame(id);
    }

    @GetMapping("/all")
    public List<Game> getAllGames() {
        return gameService.getAllGames();
    }

    @PutMapping("/update")
    public Game updateGame(@RequestBody Game game) {
        return gameService.updateGame(game);
    }

}
