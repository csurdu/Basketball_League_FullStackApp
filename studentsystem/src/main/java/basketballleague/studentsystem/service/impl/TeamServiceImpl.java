package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.dto.TeamDTO;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.TeamService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TeamServiceImpl implements TeamService {
    private final TeamRepository teamRepository;
    private PlayerRepository playerRepository;

    @Autowired
    public TeamServiceImpl(TeamRepository teamRepository,PlayerRepository playerRepository) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
    }
    private TeamDTO convertToTeamDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setTotalPoints(team.getPlayerList().stream().mapToInt(Player::getPointsPerGame).sum());
        dto.setTotalRebounds(team.getPlayerList().stream().mapToInt(Player::getReboundsPerGame).sum());
        dto.setTotalAssists(team.getPlayerList().stream().mapToInt(Player::getAssistsPerGame).sum());
        dto.setTotalSteals(team.getPlayerList().stream().mapToInt(Player::getStealsPerGame).sum());
        // ... și alte statistici pe care vrei să le adaugi
        return dto;
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
    public List<TeamDTO> findAllTeamsSortedByPoints() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalPoints))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedByRebounds() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalRebounds))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedBySteals() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalSteals))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedByAssists() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalPoints))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedByPointsDsc() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalPoints).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedByReboundsDsc() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalRebounds).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedByStealsDsc() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalSteals).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> findAllTeamsSortedByAssistsDsc() {
        return teamRepository.findAll().stream()
                .map(this::convertToTeamDTO)
                .sorted(Comparator.comparingDouble(TeamDTO::getTotalPoints).reversed())
                .collect(Collectors.toList());
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
