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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;

    @PostMapping("/signup")
    public ResponseEntity<JwtAuthenticationResponse> signup(@ModelAttribute SignUpRequest request) {
        String profilePicturePath = saveProfilePicture(request.getProfilePicture());

        User newUser = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .height(request.getHeight())
                .role(request.getRole())
                .profilePicture(profilePicturePath) // Set profile picture path
                .build();

        if (request.getRole() == null || (!request.getRole().equals(Role.PLAYER_NORMAL) && !request.getRole().equals(Role.CAPTAIN) && !request.getRole().equals(Role.ADMIN)) ) {
            return ResponseEntity.badRequest().body(new JwtAuthenticationResponse("Rol invalid!"));
        }

        return ResponseEntity.ok(authenticationService.signup(newUser));
    }

    private String saveProfilePicture(MultipartFile profilePicture) {
        if (profilePicture == null || profilePicture.isEmpty()) {
            return null;
        }

        try {
            String fileExtension = getFileExtension(profilePicture.getOriginalFilename());
            String newFileName = UUID.randomUUID().toString() + "." + fileExtension;
            Path filePath = Paths.get("uploads/profile_pictures", newFileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, profilePicture.getBytes());
            return "uploads/profile_pictures/" + newFileName; // Return relative path
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile picture", e);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        String[] parts = fileName.split("\\.");
        return parts.length > 1 ? parts[parts.length - 1] : "";
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> signin(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(authenticationService.signin(request));
    }

}
