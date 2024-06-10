package basketballleague.studentsystem.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Data
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true)
    private String name;
    private int gamesWon;
    private int gamesLost;
    private int year;
    @OneToMany(mappedBy = "team", fetch = FetchType.EAGER)
    private Set<Player> playerList;

    public void addPlayer(Player player) {
        if (playerList == null) {
            playerList = new HashSet<>();
        }
        playerList.add(player);
        player.setTeam(this);
    }

    public void removePlayer(Player player) {
        this.playerList.remove(player);
        player.setTeam(null);
    }

}
