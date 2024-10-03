package basketballleague.studentsystem.dto;

import basketballleague.studentsystem.model.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class PlayerDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String height;
    private int pointsPerGame;
    private float reboundsPerGame;
    private float stealsPerGame;
    private float assistsPerGame;
    private String teamName;

    private String email;
    private int gamesPlayed;
    private float onePointPercentage;
    private float twoPointPercentage;
    private float threePointPercentage;
    private float scoringPercentage;
}
