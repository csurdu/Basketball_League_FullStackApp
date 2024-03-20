package basketballleague.studentsystem.service.impl;

import basketballleague.studentsystem.model.Game;
import basketballleague.studentsystem.repository.GameRepository;
import basketballleague.studentsystem.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameServiceImpl implements GameService {
    private final GameRepository gameRepository;

    @Autowired
    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public Game addGame(Game game) {
        return gameRepository.save(game);
    }

    @Override
    public void deleteGame(int id) {
        gameRepository.deleteById(id);
    }

    @Override
    public Game getGameById(int id) {
        Optional<Game> game = gameRepository.findById(id);
        return game.orElse(null);
    }

    @Override
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Override
    public Game updateGame(Game game) {
        return gameRepository.save(game);
    }
}
