package com.example.timetable.web;

import com.example.timetable.models.Role;
import com.example.timetable.models.Student;
import com.example.timetable.models.User;
import com.example.timetable.models.nonEntity.userInfo.StudentUser;
import com.example.timetable.service.StudentService;
import com.example.timetable.service.auth.UserAndRoleService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/")
public class AuthenticationRestController {

    private UserAndRoleService userAndRoleService;
    private StudentService studentService;

    public AuthenticationRestController(UserAndRoleService userAndRoleService, StudentService studentService){
        this.userAndRoleService = userAndRoleService;
        this.studentService = studentService;
    }

    @PostMapping(value = "/register/student")
    public User registerStudentUser(@RequestBody StudentUser studentUser){
        User user = new User(studentUser.getEmail(), studentUser.getPassword());
        Student student = new Student(studentUser.getName(), studentUser.getSurname(), studentUser.getStudentindex(),studentUser.getEmail());
        studentService.saveStudent(student);
        return userAndRoleService.registerUser(user, "STUDENT");
    }

    @PostMapping(value = "/register/staff")
    public User registerStaffUser(@RequestBody User user) {
        return userAndRoleService.registerUser(user, "STAFF");
    }


    @GetMapping("/role/{username}")
    public Role getUserRole(@PathVariable("username") String username) {
        return userAndRoleService.getUserRoleForUsername(username);
    }

}
