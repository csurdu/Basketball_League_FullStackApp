package basketballleague.studentsystem.service;

import basketballleague.studentsystem.dto.TeamPlayersDTO;
import basketballleague.studentsystem.model.Player;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


public interface PlayerService {
    Player savePlayer(Player player);
    void deletePlayer(Integer playerId);
    List<Player> getAllPlayers();
    Player getPlayerByNameAndTeam(String name, String teamName);
    // În PlayerService.java
    TeamPlayersDTO getPlayersAndTeamInfoByTeamName(String teamName);

}
