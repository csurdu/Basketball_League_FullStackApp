package basketballleague.studentsystem.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class TeamDTO {
    private int id;
    private String name;
    private double totalPoints;
    private double totalRebounds;
    private double totalAssists;
    private double totalSteals;
}
