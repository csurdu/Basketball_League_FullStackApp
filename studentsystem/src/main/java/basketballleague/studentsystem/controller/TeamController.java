package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/team")
public class TeamController {
    private final TeamService teamService;

    @Autowired
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/add")
    public Team saveTeam(@RequestBody Team team) {
        return teamService.saveTeam(team);
    }

    @DeleteMapping("/{teamId}")
    public void deleteTeam(@PathVariable Integer teamId) {
        teamService.deleteTeam(teamId);
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/search")
    public Team getTeamByName(@RequestParam String name) {
        return teamService.getTeamByName(name);
    }

}
