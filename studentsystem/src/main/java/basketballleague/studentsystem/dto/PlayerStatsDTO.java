package basketballleague.studentsystem.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class PlayerStatsDTO {
    private Long playerId;
    private String name;
    private int points;
    private int onePointAttempts;
    private int onePointMade;
    private int twoPointAttempts;
    private int twoPointMade;
    private int threePointAttempts;
    private int threePointMade;
    private float rebounds;
    private float steals;
    private float assists;
}
