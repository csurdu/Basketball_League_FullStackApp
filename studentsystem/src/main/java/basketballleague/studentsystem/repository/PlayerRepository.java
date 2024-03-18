package basketballleague.studentsystem.repository;

import basketballleague.studentsystem.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player,Integer> {
    Optional<Player> findByNameAndTeam_Name(String name, String teamName);
}
