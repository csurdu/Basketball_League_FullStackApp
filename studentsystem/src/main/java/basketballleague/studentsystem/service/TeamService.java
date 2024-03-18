package basketballleague.studentsystem.service;

import basketballleague.studentsystem.model.Team;

import java.util.List;

public interface TeamService {

    Team saveTeam(Team team);
    void deleteTeam(Integer teamId);
    List<Team> getAllTeams();
    Team getTeamByName(String name);
}
