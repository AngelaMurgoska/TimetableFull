package com.example.timetable.models.nonEntity.userInfo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudentUser {
    private String name;

    private String surname;

    private Long studentindex;

    private String email;

    private String password;
}
