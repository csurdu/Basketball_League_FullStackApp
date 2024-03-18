package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/player")
public class PlayerController {
    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping("/add")
    public Player savePlayer(@RequestBody Player player) {
        return playerService.savePlayer(player);
    }

    @DeleteMapping("/{playerId}")
    public void deletePlayer(@PathVariable Integer playerId) {
        playerService.deletePlayer(playerId);
    }

    @GetMapping
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/search")
    public Player getPlayerByNameAndTeam(@RequestParam String name, @RequestParam String teamName) {
        return playerService.getPlayerByNameAndTeam(name, teamName);
    }
}
