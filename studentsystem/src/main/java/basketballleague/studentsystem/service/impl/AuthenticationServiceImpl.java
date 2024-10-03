package basketballleague.studentsystem.service.impl;


import basketballleague.studentsystem.dao.request.SigninRequest;
import basketballleague.studentsystem.dao.response.JwtAuthenticationResponse;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Role;
import basketballleague.studentsystem.model.User;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.UserRepository;
import basketballleague.studentsystem.service.AuthenticationService;
import basketballleague.studentsystem.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    @Override
    public JwtAuthenticationResponse signup(User request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .height(request.getHeight())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .profilePicture(request.getProfilePicture()) // Set profile picture path
                .build();
        userRepository.save(user);
        var jwt = jwtService.generateToken(user);

        Player player = new Player();
        player.setUser(user);
        player.setHeight(user.getHeight());
        player.setLastName(user.getLastName());
        player.setFirstName(user.getFirstName());
        player.setProfilePicture(user.getProfilePicture()); // Set profile picture path
        playerRepository.save(player);

        if (user.getRole() == Role.CAPTAIN) {
            player.setCaptain(true);
        }

        return JwtAuthenticationResponse.builder().token(jwt).build();
    }

    @Override
    public JwtAuthenticationResponse signin(SigninRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        var jwt = jwtService.generateToken(user);
        return JwtAuthenticationResponse.builder().token(jwt).build();
    }
}
