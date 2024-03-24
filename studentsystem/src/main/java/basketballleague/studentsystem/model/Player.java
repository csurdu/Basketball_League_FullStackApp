package basketballleague.studentsystem.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@EqualsAndHashCode(callSuper = false, exclude = "team")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String firstName;
    private String lastName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id",referencedColumnName = "id")
    private Team team;

    private String height;

    private int pointsPerGame;
    private int reboundsPerGame;
    private int stealsPerGame;
    private int assistsPerGame;

}
