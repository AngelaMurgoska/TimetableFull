package com.example.timetable.service.auth;

import com.example.timetable.models.Role;
import com.example.timetable.models.User;
import com.example.timetable.exception.models.ExistingUserException;
import com.example.timetable.exception.models.NonExistentRoleException;
import com.example.timetable.repository.RoleRepository;
import com.example.timetable.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserAndRoleService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;

    public UserAndRoleService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User registerUser(User user, String roleName) {
        Optional<User> existingUser = userRepository.findByUserName(user.getUserName());
        if (existingUser.isPresent()) {
            throw new ExistingUserException();
        } else {
            Optional<Role> role = roleRepository.findByName(roleName);
            if (role.isPresent()) {
                Role userRole = role.get();
                user.setUserRole(userRole);
                String plain = user.getPassword();
                String hashed = BCrypt.hashpw(plain, BCrypt.gensalt());
                user.setPassword(hashed);
                return userRepository.save(user);
            } else {
                throw new NonExistentRoleException();
            }
        }
    }

    public Role getUserRoleForUsername(String username) {
        Optional<User> userOptional=userRepository.findByUserName(username);
        if(userOptional.isPresent()){
            User user=userOptional.get();
            return user.getUserRole();
        }
        return null;
    }

}
