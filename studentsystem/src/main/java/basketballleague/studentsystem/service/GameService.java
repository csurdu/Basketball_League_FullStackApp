package basketballleague.studentsystem.service;

import basketballleague.studentsystem.model.Game;

import java.util.List;
import java.util.Optional;

public interface GameService {
    Game addGame(Game game);
    void deleteGame(int gameId);
    Optional<Game> getGame(int gameId);
    List<Game> getAllGames();
    Game updateGame(Game game);
    void deleteAll();

}
