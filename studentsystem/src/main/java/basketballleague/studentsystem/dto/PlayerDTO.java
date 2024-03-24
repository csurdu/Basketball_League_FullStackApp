package basketballleague.studentsystem.dto;

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
    private int reboundsPerGame;
    private int stealsPerGame;
    private int assistsPerGame;
    private String teamName;
}
