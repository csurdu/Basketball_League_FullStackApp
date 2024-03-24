package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dto.TeamPlayersDTO;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.service.PlayerService;
import basketballleague.studentsystem.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/team")
public class TeamController {
    private final TeamService teamService;
    private final PlayerService playerService;

    @Autowired
    public TeamController(TeamService teamService,PlayerService playerService) {
        this.teamService = teamService;
        this.playerService = playerService;
    }

    @PostMapping("/add")
    public Team addTeam(@RequestBody Team team) {
        return teamService.addTeam(team);
    }

    @PutMapping
    public Team updateTeam(@RequestBody Team team) {
        return teamService.updateTeam(team);
    }

    @DeleteMapping("/delete/{teamId}")
    public void deleteTeam(@PathVariable int teamId) {
        teamService.deleteTeam(teamId);
    }
    @DeleteMapping("/delete/all")
    public void deleteAll() {
        teamService.deleteAll();
    }

    @GetMapping("/{teamId}")
    public Team getTeamById(@PathVariable int teamId) {
        return teamService.getTeam(teamId);
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }
    @GetMapping("/name/{teamName}")
    public Team getTeamByName(@PathVariable String teamName) {
        return teamService.getTeambyName(teamName);
    }


}
