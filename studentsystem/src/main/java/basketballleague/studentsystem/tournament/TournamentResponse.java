package basketballleague.studentsystem.tournament;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class TournamentResponse {
    private String winner;
    private Bracket bracket;

    public TournamentResponse(String winner, Bracket bracket) {
        this.winner = winner;
        this.bracket = bracket;
    }
}
