package basketballleague.studentsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team1_id", referencedColumnName = "id") // Schimbă numele coloanei pentru prima echipă
    private Team team1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team2_id", referencedColumnName = "id") // Schimbă numele coloanei pentru a doua echipă
    private Team team2;

    private String date;
    private int hour;

    private int score;



}
