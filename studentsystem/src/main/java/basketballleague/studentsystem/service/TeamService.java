package basketballleague.studentsystem.service;

import basketballleague.studentsystem.dto.TeamDTO;
import basketballleague.studentsystem.model.Team;

import java.util.List;

public interface TeamService {

    Team addTeam(Team team);
    void deleteTeam(String teamName);
    Team getTeam(int teamId);
    Team getTeambyName(String name);
    List<Team> getAllTeams();
    Team updateTeam(Team team);
    void deleteAll();
    public List<TeamDTO> findAllTeamsSortedByPoints();
    public List<TeamDTO> findAllTeamsSortedByRebounds();
    public List<TeamDTO> findAllTeamsSortedBySteals();
    public List<TeamDTO> findAllTeamsSortedByAssists();
    public List<TeamDTO> findAllTeamsSortedByPointsDsc();
    public List<TeamDTO> findAllTeamsSortedByReboundsDsc();
    public List<TeamDTO> findAllTeamsSortedByStealsDsc();
    public List<TeamDTO> findAllTeamsSortedByAssistsDsc();
    public List<TeamDTO> findAllTeamsGamesLost();
    public List<TeamDTO> findAllTeamsGamesWon();
}
