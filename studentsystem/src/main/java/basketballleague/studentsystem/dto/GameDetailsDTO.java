package basketballleague.studentsystem.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Data
@Getter
@Setter
public class GameDetailsDTO {
    private int id;
    private String date;
    private String location;
    private String status;
    private TeamDTO teamA;
    private TeamDTO teamB;
    private int scoreTeamA;
    private int scoreTeamB;
    private List<PlayerStatsDTO> teamAPlayerStats;
    private List<PlayerStatsDTO> teamBPlayerStats;
    private List<GameEventDTO> events;  // Adăugarea listei de evenimente
}
