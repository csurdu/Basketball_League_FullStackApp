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

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
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
    public List<PlayerDTO> findByOrderByPointsPerGameAsc() {
        return playerRepository.findByOrderByPointsPerGameAsc()
                .stream()
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByReboundsPerGameAsc() {
        return playerRepository.findByOrderByReboundsPerGameAsc()
                .stream()
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByStealsPerGameAsc() {
        return playerRepository.findByOrderByStealsPerGameAsc()
                .stream()
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByAssistsPerGameAsc() {
        return playerRepository.findByOrderByAssistsPerGameAsc()
                .stream()
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByPointsPerGameDsc() {
        return playerRepository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(Player::getPointsPerGame).reversed()) // Descending order
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByReboundsPerGameDsc() {
        return playerRepository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(Player::getReboundsPerGame).reversed()) // Descending order
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByStealsPerGameDsc() {
        return playerRepository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(Player::getStealsPerGame).reversed()) // Descending order
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDTO> findByOrderByAssistsPerGameDsc() {
        return playerRepository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(Player::getAssistsPerGame).reversed()) // Descending order
                .map(this::convertToPlayerDTO)
                .collect(Collectors.toList());
    }


    @Override
    public void deletePlayer(int id) {
        playerRepository.deleteById(id);
    }

    @Override
    public void populateDatabaseWithFakeData() {
        List<Player> fakePlayers = new ArrayList<>();
        // Generate fake data for players
        for (int i = 1; i <= 20; i++) {
            Player player = new Player();
            player.setFirstName("First" + i);
            player.setLastName("Last" + i);
            player.setHeight(String.valueOf((int) (Math.random() * 20) + 180)); // Random height between 180cm and 200cm
            player.setPointsPerGame((int) Math.round(Math.random() * 30)); // Random points per game
            player.setReboundsPerGame((int) Math.round(Math.random() * 10)); // Random rebounds per game
            player.setStealsPerGame((int) Math.round(Math.random() * 5)); // Random steals per game
            player.setAssistsPerGame((int) Math.round(Math.random() * 10)); // Random assists per game
            // Add more fields as needed
            fakePlayers.add(player);
        }

        // Save fake players to the database
        playerRepository.saveAll(fakePlayers);
    }
    public void assignPlayersToRandomTeams() {
        List<Player> playersWithoutTeam = playerRepository.findPlayersWithoutTeam(); // Implement this query
        List<Team> availableTeams = teamRepository.findAll(); // Assumes you have this method

        if (availableTeams.isEmpty()) {
            throw new IllegalStateException("No teams available for assignment.");
        }

        Random random = new Random();
        playersWithoutTeam.forEach(player -> {
            // Assign a random team to each player
            Team randomTeam = availableTeams.get(random.nextInt(availableTeams.size()));
            player.setTeam(randomTeam); // Assuming Player has a setTeam method
            playerRepository.save(player);
        });
    }

}


