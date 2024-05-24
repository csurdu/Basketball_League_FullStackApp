package basketballleague.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Data
@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_a_id")
    private Team teamA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_b_id")
    private Team teamB;

    private int scoreTeamA;
    private int scoreTeamB;
    private LocalDateTime date;
    private String location;
    private GameStatus status;

    public enum GameStatus {
        SCHEDULED, IN_PROGRESS, FINISHED
    }

}
