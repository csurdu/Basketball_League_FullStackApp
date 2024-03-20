package basketballleague.studentsystem.service;

import basketballleague.studentsystem.model.Game;

import java.util.List;

public interface GameService {
    Game addGame(Game game);
    void deleteGame(int id);
    Game getGameById(int id);
    List<Game> getAllGames();
    Game updateGame(Game game);
}
