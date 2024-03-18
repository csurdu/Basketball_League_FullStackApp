package basketballleague.studentsystem.dto;

import basketballleague.studentsystem.model.Player;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class TeamPlayersDTO {
    private String teamName;
    private String teamYear;
    private List<Player> players;

    public TeamPlayersDTO(String teamName, String teamYear, List<Player> players) {
        this.teamName = teamName;
        this.teamYear = teamYear;
        this.players = players;
    }
}
