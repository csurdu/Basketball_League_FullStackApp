package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dto.PlayerDTO;
import basketballleague.studentsystem.model.*;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.UserRepository;
import basketballleague.studentsystem.service.PlayerService;
import basketballleague.studentsystem.service.TeamService;
import basketballleague.studentsystem.service.UserService;
import ch.qos.logback.core.joran.spi.ElementSelector;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/player")
public class PlayerController {
    private final PlayerService playerService;
    private final UserRepository userRepository;
    private final TeamService teamService;
    private final UserService userService;

private final PlayerRepository playerRepository;




    @Autowired
    public PlayerController(PlayerService playerService, UserRepository userRepository, TeamService teamService, UserService userService, PlayerRepository playerRepository) {
        this.playerService = playerService;
        this.userRepository = userRepository;
        this.teamService = teamService;
        this.userService = userService;

        this.playerRepository = playerRepository;
    }
    @GetMapping("/{playerId}")
    public PlayerDTO getPlayer(@PathVariable int playerId) {
        return playerService.getPlayer(playerId);
    }
    @GetMapping("/name")
    public Player getPlayerByFirstAndLastName(@RequestParam String firstName, @RequestParam String lastName) {
        Optional<Player> player = playerService.getPlayerByFirstNameAndLastName(firstName, lastName);
        return player.orElse(null); // Handle the case where no player is found
    }
    @PostMapping("/add")
    public Player savePlayer(@RequestBody Player player) {
        return playerService.addPlayer(player);
    }
    @PostMapping("/removeFromTeam/{userId}")
    public ResponseEntity<?> removePlayerFromTeam(@PathVariable int userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId));
            playerService.removePlayerFromTeam(user.getPlayer().getId());
            return ResponseEntity.ok("Player removed from the team successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to remove player from team: " + e.getMessage());
        }
    }
    @DeleteMapping("/{playerId}")
    public void deletePlayer(@PathVariable Integer playerId) {
        playerService.deletePlayer(playerId);
    }

    @GetMapping
    public List<PlayerDTO> getAllPlayers() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/without-team")
    public List<PlayerDTO> getPlayersWithoutTeam() {
        return playerService.getPlayersWithoutTeam();
    }

    @GetMapping("/with-team")
    public List<PlayerDTO> getPlayersWithTeam() {
        return playerService.getPlayersWithTeam();
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

    @DeleteMapping("/deleteAll")
    public Exception deleteAllPlayers() {
        try {
            playerService.deleteAll();

        } catch (Exception e) {
            return new Exception("Failde to delete all players");
        }
        return null;
    }
    private static final Logger logger = LoggerFactory.getLogger(TeamController.class);
    @PostMapping("/createAndJoinTeam/{userId}")
    public ResponseEntity<String> createAndJoinTeam(@PathVariable int userId, @RequestBody Team team) {
        logger.info("Received request to create and join team '{}' for user ID {}", team.getName(), userId);
        try {
            User user = userRepository.findById(userId).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId));
//            logger.info("User found: {}", user.getUsername());
//
//
//
            logger.info("User Role: {}", user.getRole());
            if (!user.getRole().equals(Role.CAPTAIN)) {
                logger.error("User with ID {} does not have the required role to create a team", userId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You are not authorized to create and join a team");
            }
            team = teamService.addTeam(team);
            logger.info("Team created: {}", team.getName());

            if (user.getPlayer() == null) {
                logger.error("No player associated with user ID {}", userId);
                throw new IllegalStateException("No player associated with this user.");
            }

            playerService.joinTeam(user.getPlayer().getId(), team.getName());
            logger.info("Player {} joined team {}", user.getPlayer().getId(), team.getName());

            return ResponseEntity.ok("Echipa a fost creată și jucătorul s-a alăturat cu succes.");
        } catch (Exception e) {
            logger.error("Error creating and joining team: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la crearea și adăugarea jucătorului în echipă: " + e.getMessage());
        }
    }
    @PostMapping("/{playerId}/joinTeam/{teamName}")
    public ResponseEntity<String> joinTeam(@PathVariable int playerId, @PathVariable String teamName)
    {
        try {
            playerService.joinTeam(playerId, teamService.getTeambyName(teamName).getName());

            // Returnează un răspuns de succes
            return ResponseEntity.ok("Echipa a fost creată și jucătorul s-a alăturat cu succes.");
        } catch (Exception e) {
            // În caz de eroare, returnează un răspuns cu eroarea
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la crearea și adăugarea jucătorului în echipă: " + e.getMessage());
        }
    }


    @GetMapping("/invitations/{userId}/pending")
    public List<Invitation> getPendingInvitations(@PathVariable int userId) {
        return playerService.getPendingInvitations(userId);
    }
    @GetMapping("/invitations/{userId}/pending/count")
    public ResponseEntity<Integer> getPendingInvitationsCount(@PathVariable int userId) {
        try {
            int count = playerService.getPendingInvitations(userId).size();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/invitations/{invitationId}/accept")
    public ResponseEntity<String> acceptInvitation(@PathVariable int invitationId) {
        try {
            playerService.acceptInvitation(invitationId);
            return ResponseEntity.ok("Invitation accepted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to accept invitation: " + e.getMessage());
        }
    }

    @PostMapping("/invitations/{invitationId}/reject")
    public ResponseEntity<String> rejectInvitation(@PathVariable int invitationId) {
        try {
            playerService.rejectInvitation(invitationId);
            return ResponseEntity.ok("Invitation rejected successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reject invitation: " + e.getMessage());
        }
    }
    @PostMapping("/sendInvitation/{playerEmail}/toTeam/{teamName}")
    public ResponseEntity<String> sendInvitation(@PathVariable String playerEmail, @PathVariable String teamName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            User curruser = (User) userService.loadUserByUsername(userEmail);// userEmail este numele de utilizator (email) așa cum este stocat în JWT
            if (curruser.getRole() == Role.CAPTAIN) {
             User user = userRepository.findByEmail(playerEmail).orElseThrow(() ->
                     new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + playerEmail));
             Team team = teamService.getTeambyName(teamName);
             Invitation invitation = playerService.sendInvitation(user.getPlayer().getId(), team.getId());
             return ResponseEntity.ok("Invitation sent successfully to Player ID: " + user.getPlayer().getId() + " for Team ID: " + team.getId());

         }
            else
         {
             return ResponseEntity.status(HttpStatus.FORBIDDEN)
                     .body("You are not authorized to send invitations");
         }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send invitation: " + e.getMessage());
        }
    }


}
