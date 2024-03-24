package basketballleague.studentsystem.service;

import basketballleague.studentsystem.model.Team;

import java.util.List;

public interface TeamService {

    Team addTeam(Team team);
    void deleteTeam(int teamId);
    Team getTeam(int teamId);
    Team getTeambyName(String name);
    List<Team> getAllTeams();
    Team updateTeam(Team team);
    void deleteAll();
}
