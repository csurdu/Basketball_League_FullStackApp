package basketballleague.studentsystem.service;


import basketballleague.studentsystem.dao.request.SignUpRequest;
import basketballleague.studentsystem.dao.request.SigninRequest;
import basketballleague.studentsystem.dao.response.JwtAuthenticationResponse;

public interface AuthenticationService {
    JwtAuthenticationResponse signup(SignUpRequest request);

    JwtAuthenticationResponse signin(SigninRequest request);
}
