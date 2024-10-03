package basketballleague.studentsystem.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class GameDTO {

    private int id;
    private String team1Name;
    private String team2Name;
    private String date;
    private int hour;
    private int scoreA;
    private int scoreB;
    private String location;

}
