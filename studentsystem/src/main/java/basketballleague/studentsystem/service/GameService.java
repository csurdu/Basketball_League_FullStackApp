package basketballleague.studentsystem.service;

import basketballleague.studentsystem.model.Game;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface GameService {
    void simulateGame(Game game);

    public Game createGame(String teamAname, String teamBname, String location,LocalDateTime date);
    public List<Game> getFinishedGames();

    }