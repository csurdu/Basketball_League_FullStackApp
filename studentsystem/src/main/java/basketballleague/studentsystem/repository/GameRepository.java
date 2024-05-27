package basketballleague.studentsystem.repository;

import basketballleague.studentsystem.model.Game;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game,Integer> {
    @EntityGraph(attributePaths = {"teamA", "teamB"})
    List<Game> findByStatus(Game.GameStatus status);

}
