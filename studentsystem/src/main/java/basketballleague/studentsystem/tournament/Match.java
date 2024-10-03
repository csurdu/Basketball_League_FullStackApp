package basketballleague.studentsystem.tournament;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class Match {
    private int gameId;
    private String teamA;
    private String teamB;
    private int scoreA;
    private int scoreB;

    public Match(int gameId, String teamA, String teamB, int scoreA, int scoreB) {
        this.gameId = gameId;
        this.teamA = teamA;
        this.teamB = teamB;
        this.scoreA = scoreA;
        this.scoreB = scoreB;
    }
}
