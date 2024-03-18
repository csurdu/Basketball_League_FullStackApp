package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.TeamService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamServiceImpl implements TeamService {
    private final TeamRepository teamRepository;

    @Autowired
    public TeamServiceImpl(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Override
    @Transactional
    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }

    @Override
    @Transactional
    public void deleteTeam(Integer teamId) {
        teamRepository.deleteById(teamId);
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    public Team getTeamByName(String name) {
        return teamRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }
}
