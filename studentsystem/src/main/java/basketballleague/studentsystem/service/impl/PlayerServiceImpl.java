package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.dto.PlayerDTO;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Team;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.TeamRepository;
import basketballleague.studentsystem.service.PlayerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Autowired
    public PlayerServiceImpl(PlayerRepository playerRepository,TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    @Override
    public Player addPlayer(Player player) {
        player.setTeam(null); // Ensure the team is null when adding a new player
        return playerRepository.save(player);
    }

    @Override
    public PlayerDTO getPlayer(int id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player not found for ID: " + id));
        return convertToPlayerDTO(player);
    }

    @Override
    public List<PlayerDTO> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        return players.stream().map(this::convertToPlayerDTO).collect(Collectors.toList());
    }

    @Override
    public Player joinTeam(int playerId, String teamName) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new EntityNotFoundException("Player not found for ID: " + playerId));

        // Find the team by name
        Team team = teamRepository.findByName(teamName)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with name: " + teamName));

        // Add the player to the team
        team.addPlayer(player);

        // Save the team and player entities to update the database
        // Note: Depending on your JPA cascade settings, saving the team might be enough to persist the changes to the player.
        // If not, save the player explicitly.
        teamRepository.save(team);
        return playerRepository.save(player);
    }

    private PlayerDTO convertToPlayerDTO(Player player) {
        PlayerDTO dto = new PlayerDTO();
        dto.setId(player.getId());
        dto.setFirstName(player.getFirstName());
        dto.setLastName(player.getLastName());
        dto.setHeight(player.getHeight());
        dto.setPointsPerGame(player.getPointsPerGame());
        dto.setReboundsPerGame(player.getReboundsPerGame());
        dto.setStealsPerGame(player.getStealsPerGame());
        dto.setAssistsPerGame(player.getAssistsPerGame());
        if (player.getTeam() != null) {
            dto.setTeamName(player.getTeam().getName());
        }
        return dto;
    }
    @Override
    public Player updatePlayer(Player player) {
        return playerRepository.save(player);
    }

    @Override
    public void deletePlayer(int id) {
        playerRepository.deleteById(id);
    }


}


