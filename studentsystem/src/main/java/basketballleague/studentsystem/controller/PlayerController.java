package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dto.PlayerDTO;
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
    @GetMapping("/{playerId}")
    public PlayerDTO getPlayer(@PathVariable int playerId) {
        return playerService.getPlayer(playerId);
    }

    @PostMapping("/add")
    public Player savePlayer(@RequestBody Player player) {
        return playerService.addPlayer(player);
    }

    @DeleteMapping("/{playerId}")
    public void deletePlayer(@PathVariable Integer playerId) {
        playerService.deletePlayer(playerId);
    }

    @GetMapping
    public List<PlayerDTO> getAllPlayers() {
        return playerService.getAllPlayers();
    }
    @PutMapping("/{playerId}/joinTeam/{teamName}")
    public Player joinTeam(@PathVariable int playerId, @PathVariable String teamName) {
        return playerService.joinTeam(playerId, teamName);
    }


}
