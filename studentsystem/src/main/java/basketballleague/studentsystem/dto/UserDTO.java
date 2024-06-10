package basketballleague.studentsystem.dto;

import basketballleague.studentsystem.model.Player;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserDTO {
    private Integer id;
    private String firstName;
    private String lastName;

    private String email;

    private Player player;

    private boolean isCaptain;

    private String profilePicture;

}
