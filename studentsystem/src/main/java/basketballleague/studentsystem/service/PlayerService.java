package basketballleague.studentsystem.service;

import basketballleague.studentsystem.dto.PlayerDTO;
import basketballleague.studentsystem.model.Invitation;
import basketballleague.studentsystem.model.Player;

import java.util.List;
import java.util.Optional;


public interface PlayerService {
    public Optional<Player> getPlayerByFirstNameAndLastName(String firstName, String lastName);
    Player addPlayer(Player player);
    public void removePlayerFromTeam(int playerId);
    void deletePlayer(int playerId);
    void deleteAll();
    PlayerDTO getPlayer(int playerId);
    List<PlayerDTO> getAllPlayers();
    Player joinTeam(int playerId, String teamName);
    Player updatePlayer(Player player);
    public List<PlayerDTO> getPlayersWithoutTeam();


    public List<PlayerDTO> getPlayersWithTeam();
    List<PlayerDTO> findByOrderByPointsPerGameAsc();

    // Similarly for rebounds, steals, and assists
    List<PlayerDTO> findByOrderByReboundsPerGameAsc();
    List<PlayerDTO> findByOrderByStealsPerGameAsc();
    List<PlayerDTO> findByOrderByAssistsPerGameAsc();

    List<PlayerDTO> findByOrderByPointsPerGameDsc();

    // Similarly for rebounds, steals, and assists
    List<PlayerDTO> findByOrderByReboundsPerGameDsc();
    List<PlayerDTO> findByOrderByStealsPerGameDsc();
    List<PlayerDTO> findByOrderByAssistsPerGameDsc();
    public void populateDatabaseWithFakeData();
    public void assignPlayersToRandomTeams();
    public Invitation sendInvitation(int playerId, int teamId,String email);
    List<Invitation> getPendingInvitations(int userId);
    Invitation acceptInvitation(int invitationId);
    void rejectInvitation(int invitationId);
    List<Invitation> getInvitationsSentByPlayer(int playerId);

}
