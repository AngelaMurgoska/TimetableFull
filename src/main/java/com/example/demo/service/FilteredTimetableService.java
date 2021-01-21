package com.example.demo.service;

import com.example.demo.models.Semester;
import com.example.demo.models.nonEntity.timetables.FilteredTimetable;

import java.util.List;

public interface FilteredTimetableService {

    List<FilteredTimetable> getFilteredTimetableWithParameters(Semester semester, String professorId, String room, String studentGroup);

}
