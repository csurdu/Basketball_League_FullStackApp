package basketballleague.studentsystem.service;

import basketballleague.studentsystem.dto.GameDTO;
import basketballleague.studentsystem.dto.GameDetailsDTO;
import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.tournament.TournamentResponse;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface GameService {
    void simulateGame(Game game);

    public Game createGame(String teamAname, String teamBname, String location,LocalDateTime date);
    public List<GameDTO> getFinishedGames();
    public GameDetailsDTO getGameDetails(int gameId);
   void simulateTournament(List<String> teamNames);

    public List<GameDTO> getGamesByStatus(Game.GameStatus status);
}