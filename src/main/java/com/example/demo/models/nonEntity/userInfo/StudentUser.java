package com.example.demo.models.nonEntity.userInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.Column;

@Data
@NoArgsConstructor
public class StudentUser {
    private String name;

    private String surname;

    private Long studentindex;

    private String email;

    private String password;
}
