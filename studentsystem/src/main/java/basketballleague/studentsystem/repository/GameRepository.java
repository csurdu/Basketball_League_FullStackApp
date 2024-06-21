package basketballleague.studentsystem.repository;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.model.Team;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game,Integer> {
    @EntityGraph(attributePaths = {"teamA", "teamB"})
    List<Game> findByStatus(Game.GameStatus status);
    List<Game> findByTeamAOrTeamB(Team teamA, Team teamB);
    boolean existsByTeamAAndTeamBAndDateBetween(Team teamA, Team teamB, LocalDateTime startDate, LocalDateTime endDate);


}
