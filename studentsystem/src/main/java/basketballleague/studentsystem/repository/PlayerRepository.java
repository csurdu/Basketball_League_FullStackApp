package basketballleague.studentsystem.repository;

import basketballleague.studentsystem.dto.PlayerDTO;
import basketballleague.studentsystem.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player,Integer> {
    List<Player> findByOrderByPointsPerGameAsc();

    // Similarly for rebounds, steals, and assists
    List<Player> findByOrderByReboundsPerGameAsc();
    List<Player> findByOrderByStealsPerGameAsc();
    List<Player> findByOrderByAssistsPerGameAsc();
    @Query("SELECT p FROM Player p WHERE p.team IS NULL")
    List<Player> findPlayersWithoutTeam();

}
