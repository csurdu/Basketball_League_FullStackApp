package basketballleague.studentsystem.controller;

import basketballleague.studentsystem.dao.request.SignUpRequest;
import basketballleague.studentsystem.dao.request.SigninRequest;
import basketballleague.studentsystem.dao.response.JwtAuthenticationResponse;
import basketballleague.studentsystem.model.Player;
import basketballleague.studentsystem.model.Role;
import basketballleague.studentsystem.model.User;
import basketballleague.studentsystem.repository.PlayerRepository;
import basketballleague.studentsystem.repository.UserRepository;
import basketballleague.studentsystem.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> signup(@RequestBody SignUpRequest request) {
        User newUser = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword()) // This should be encoded by the service
                .height(request.getHeight())
                .role(request.getRole()) // Ensure role is provided in the request
                .build();
        if (request.getRole() == null || (!request.getRole().equals(Role.PLAYER_NORMAL) && !request.getRole().equals(Role.CAPTAIN))) {
            return ResponseEntity.badRequest().body(new JwtAuthenticationResponse("Rol invalid!"));
        }
        System.out.println("User created successfully with email: " + newUser.getEmail() + " and role: " + newUser.getRole());

        return ResponseEntity.ok(authenticationService.signup(newUser));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(authenticationService.signin(request));
    }

}
