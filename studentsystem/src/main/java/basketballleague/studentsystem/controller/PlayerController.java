package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dto.PlayerDTO;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @GetMapping("/points/ascending")
    public List<PlayerDTO> findPlayersSortedByPoints() {
        return playerService.findByOrderByPointsPerGameAsc();
    }
    @GetMapping("/rebounds/ascending")
    public List<PlayerDTO> findPlayersSortedByRebounds() {
        return playerService.findByOrderByReboundsPerGameAsc();
    }
    @GetMapping("/steals/ascending")
    public List<PlayerDTO> findPlayersSortedBySteals() {
        return playerService.findByOrderByStealsPerGameAsc();
    }
    @GetMapping("/assists/ascending")
    public List<PlayerDTO> findPlayersSortedByAssists() {
        return playerService.findByOrderByAssistsPerGameAsc();
    }
    @GetMapping("/points/descending")
    public List<PlayerDTO> findPlayersSortedByPointsDescending() {
        return playerService.findByOrderByPointsPerGameDsc();
    }
    @GetMapping("/rebounds/descending")
    public List<PlayerDTO> findPlayersSortedByReboundsDescending() {
        return playerService.findByOrderByReboundsPerGameDsc();
    }
    @GetMapping("/steals/descending")
    public List<PlayerDTO> findPlayersSortedByStealsDescending() {
        return playerService.findByOrderByStealsPerGameDsc();
    }
    @GetMapping("/assists/descending")
    public List<PlayerDTO> findPlayersSortedByAssistsDescending() {
        return playerService.findByOrderByAssistsPerGameDsc();
    }
    @PutMapping("/{playerId}/joinTeam/{teamName}")
    public Player joinTeam(@PathVariable int playerId, @PathVariable String teamName) {
        return playerService.joinTeam(playerId, teamName);
    }
    @PostMapping("/populateFakeData")
    public ResponseEntity<String> populateDatabaseWithFakePlayers() {
        try {
            playerService.populateDatabaseWithFakeData();
            return new ResponseEntity<>("Database successfully populated with fake player data.", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to populate database with fake player data.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/assignPlayersToTeams")
    public ResponseEntity<String> assignPlayersToRandomTeams() {
        try {
            playerService.assignPlayersToRandomTeams();
            return ResponseEntity.ok("Players have been successfully assigned to random teams.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Failed to assign players to teams: " + e.getMessage());
        }
    }

}
