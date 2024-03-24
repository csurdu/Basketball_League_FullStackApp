package basketballleague.studentsystem.service;

import basketballleague.studentsystem.dto.PlayerDTO;
import basketballleague.studentsystem.model.Player;

import java.util.List;
import java.util.Optional;


public interface PlayerService {
    Player addPlayer(Player player);
    void deletePlayer(int playerId);
    PlayerDTO getPlayer(int playerId);
    List<PlayerDTO> getAllPlayers();
    Player joinTeam(int playerId, String teamName);
    Player updatePlayer(Player player);

}
