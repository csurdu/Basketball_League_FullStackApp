package basketballleague.studentsystem.tournament;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
public class Bracket {
    private List<Match> matches;

    public Bracket(List<Match> matches) {
        this.matches = matches;
    }
}
