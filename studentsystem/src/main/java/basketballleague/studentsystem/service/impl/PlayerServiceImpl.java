package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.dto.TeamPlayersDTO;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.PlayerService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public PlayerServiceImpl(PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    @Override
    @Transactional
    public Player savePlayer(Player player) {
        String teamName = player.getTeam().getName();
        Team team = teamRepository.findByName(teamName)
                .orElseGet(() -> {
                    // Assuming you want to create a new team if it doesn't exist.
                    Team newTeam = new Team();
                    newTeam.setName(teamName);
                    return teamRepository.save(newTeam);
                });
        player.setTeam(team); // Set the persisted team to the player
        return playerRepository.save(player);
    }

    @Override
    @Transactional
    public void deletePlayer(Integer playerId) {
        playerRepository.deleteById(playerId);
    }

    @Override
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @Override
    public Player getPlayerByNameAndTeam(String name, String teamName) {
        return playerRepository.findByNameAndTeam_Name(name, teamName)
                .orElseThrow(() -> new RuntimeException("Player not found"));
    }

    @Override
    public TeamPlayersDTO getPlayersAndTeamInfoByTeamName(String teamName) {
        Team team = teamRepository.findByName(teamName)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        List<Player> players = playerRepository.findByTeam_Name(teamName);
        return new TeamPlayersDTO(team.getName(), team.getYear(), players);
    }

}


