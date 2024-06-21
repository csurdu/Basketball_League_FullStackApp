package basketballleague.studentsystem.repository;

import basketballleague.studentsystem.model.Invitation;
import basketballleague.studentsystem.model.InvitationStatus;
import basketballleague.studentsystem.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    List<Invitation> findByPlayerIdAndStatus(int playerId, InvitationStatus status);

    boolean existsByPlayerIdAndTeamIdAndStatus(int playerId, int teamId, InvitationStatus status);
    List<Invitation> findByTeam(Team team);
    List<Invitation> findBySenderId(int senderId);


}
