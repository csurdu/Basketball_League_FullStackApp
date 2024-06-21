package basketballleague.studentsystem.repository;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.model.GameEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface GameEventRespository extends JpaRepository<GameEvent, Integer> {
    List<GameEvent> findByGameOrderByTimestampAsc(Game game);
    List<GameEvent> findByGame(Game game);

}
