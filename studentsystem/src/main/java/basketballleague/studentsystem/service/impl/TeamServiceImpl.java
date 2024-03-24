package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.TeamService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TeamServiceImpl implements TeamService {
    private final TeamRepository teamRepository;
    private PlayerRepository playerRepository;

    @Autowired
    public TeamServiceImpl(TeamRepository teamRepository,PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }

    @Override
    public Team addTeam(Team team) {
        return teamRepository.save(team);
    }

    @Override
    public Team updateTeam(Team team) {
        return teamRepository.save(team);
    }

    @Override
    public void deleteAll() {
        teamRepository.deleteAll();
    }

    @Override
    public void deleteTeam(int teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found for ID: " + teamId));

        // Find all players belonging to the team
        Set<Player> players = team.getPlayerList();

        // Unassign each player from the team
        players.forEach(player -> {
            player.setTeam(null);
            playerRepository.save(player); // Save each player with the team set to null
        });

        // Delete the team
        teamRepository.delete(team);
    }

    @Override
    public Team getTeam(int teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));


    }

    @Override
    public Team getTeambyName(String name) {
        return teamRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with name: " + name));
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
}
