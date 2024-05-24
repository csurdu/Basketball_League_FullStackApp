package basketballleague.studentsystem.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Entity
@EqualsAndHashCode(callSuper = false, exclude = "team")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String firstName;
    private String lastName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", referencedColumnName = "id")
    private Team team;
    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id") // This is the column in the 'player' table that references 'id' in the '_user' table
    private User user;
    private String height;
    private int inGamePoints;
    private float inGameRebounds;
    private float inGameSteals;
    private float inGameAssists;

    private int inGame1PointAttempts; // Attempts for 1-point shots
    private int inGame2PointAttempts; // Attempts for 2-point shots
    private int inGame3PointAttempts; // Attempts for 3-point shots

    private int inGame1PointMade; // Successful 1-point shots
    private int inGame2PointMade; // Successful 2-point shots
    private int inGame3PointMade; // Successful 3-point shots

    private int gamesPlayed;
    private int pointsPerGame;
    private float reboundsPerGame;
    private float stealsPerGame;
    private float assistsPerGame;

    private float scoringPercentage; // Overall scoring percentage
    private float onePointPercentage; // Percentage for 1-point shots
    private float twoPointPercentage; // Percentage for 2-point shots
    private float threePointPercentage; // Percentage for 3-point shots

    private boolean isCaptain;

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName);  // Safe fields
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Player player = (Player) obj;
        return id == player.id &&
                Objects.equals(firstName, player.firstName) &&
                Objects.equals(lastName, player.lastName);
    }

    public void updateGamesPlayed() {
        this.gamesPlayed++;
    }

    public void updateScoringPercentages() {
        int totalAttempts = this.inGame1PointAttempts + this.inGame2PointAttempts + this.inGame3PointAttempts;
        int totalMade = this.inGame1PointMade + this.inGame2PointMade + this.inGame3PointMade;

        if (totalAttempts > 0) {
            this.scoringPercentage = ((float) totalMade / totalAttempts) * 100;
        } else {
            this.scoringPercentage = 0;
        }

        if (this.inGame1PointAttempts > 0) {
            this.onePointPercentage = ((float) this.inGame1PointMade / this.inGame1PointAttempts) * 100;
        } else {
            this.onePointPercentage = 0;
        }

        if (this.inGame2PointAttempts > 0) {
            this.twoPointPercentage = ((float) this.inGame2PointMade / this.inGame2PointAttempts) * 100;
        } else {
            this.twoPointPercentage = 0;
        }

        if (this.inGame3PointAttempts > 0) {
            this.threePointPercentage = ((float) this.inGame3PointMade / this.inGame3PointAttempts) * 100;
        } else {
            this.threePointPercentage = 0;
        }
    }
}
