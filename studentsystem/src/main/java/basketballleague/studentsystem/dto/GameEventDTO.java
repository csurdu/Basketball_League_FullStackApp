package basketballleague.studentsystem.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class GameEventDTO {
    private int id;
    private String eventType;
    private String description;
    private String timestamp;
}
