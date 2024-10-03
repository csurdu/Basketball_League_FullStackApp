package basketballleague.studentsystem.service;


import basketballleague.studentsystem.dao.request.SigninRequest;
import basketballleague.studentsystem.dao.response.JwtAuthenticationResponse;
import basketballleague.studentsystem.model.User;

public interface AuthenticationService {
    JwtAuthenticationResponse signup(User request);


    JwtAuthenticationResponse signin(SigninRequest request);
}
