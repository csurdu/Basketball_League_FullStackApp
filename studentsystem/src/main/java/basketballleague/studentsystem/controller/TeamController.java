package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dto.TeamDTO;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.service.PlayerService;
import basketballleague.studentsystem.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
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

    @DeleteMapping("/delete/{teamName}")
    public void deleteTeam(@PathVariable String teamName) {
        teamService.deleteTeam(teamName);
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


    @GetMapping("/points/ascending")
    public List<TeamDTO> getAllTeamsSortedByPointsAsc() {
        return teamService.findAllTeamsSortedByPoints();
    }
    @GetMapping("/rebounds/ascending")
    public List<TeamDTO> getAllTeamsSortedByReboundsAsc() {
        return teamService.findAllTeamsSortedByRebounds();
    }
    @GetMapping("/steals/ascending")
    public List<TeamDTO> getAllTeamsSortedByStealsAsc() {
        return teamService.findAllTeamsSortedBySteals();
    }
    @GetMapping("/assists/ascending")
    public List<TeamDTO> getAllTeamsSortedByAssistsAsc() {
        return teamService.findAllTeamsSortedByAssists();
    }
    @GetMapping("/points/descending")
    public List<TeamDTO> getAllTeamsSortedByPointsDsc() {
        return teamService.findAllTeamsSortedByPointsDsc();
    }
    @GetMapping("/rebounds/descending")
    public List<TeamDTO> getAllTeamsSortedByReboundsDsc() {
        return teamService.findAllTeamsSortedByReboundsDsc();
    }
    @GetMapping("/steals/descending")
    public List<TeamDTO> getAllTeamsSortedByStealsDsc() {
        return teamService.findAllTeamsSortedByStealsDsc();
    }
    @GetMapping("/assists/descending")
    public List<TeamDTO> getAllTeamsSortedByAssistsDsc() {
        return teamService.findAllTeamsSortedByAssistsDsc();
    }


}
