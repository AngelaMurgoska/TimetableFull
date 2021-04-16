package com.example.timetable.service;

import com.example.timetable.models.Semester;
import com.example.timetable.models.nonEntity.timetables.FilteredTimetable;

import java.util.List;

public interface FilteredTimetableService {

    List<FilteredTimetable> getFilteredTimetableListWithParameters(Semester semester, String professorId, String room, String studentGroup);

}
