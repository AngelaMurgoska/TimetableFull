package com.example.timetable.service.impl;

import com.example.timetable.models.Semester;
import com.example.timetable.models.Timetable;
import com.example.timetable.models.nonEntity.timetables.FilteredTimetable;
import com.example.timetable.service.FilteredTimetableService;
import com.example.timetable.service.TimetableService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FilteredTimetableServiceImpl implements FilteredTimetableService {

    private TimetableService timetableService;

    public FilteredTimetableServiceImpl(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @Override
    public List<FilteredTimetable> getFilteredTimetableListWithParameters(Semester semester, String professorId, String room, String studentGroup) {
        Long lastTimetableVersion=timetableService.getLatestTimetableVersionInSemester(semester.getId());
        Long professorIdLong = professorId != null ? Long.parseLong(professorId) : null;
        List<Timetable> timetableList = timetableService.getTimetableByProfessorIdAndRoomAndStudentgroupAndSemesterIdAndVersion(professorIdLong, room, studentGroup, semester.getId(), lastTimetableVersion);
        return getFilteredTimetableListFromTimetableList(timetableList);
    }

    private List<FilteredTimetable> getFilteredTimetableListFromTimetableList(List<Timetable> timetableList){
        List<FilteredTimetable> filteredTimetableList = new ArrayList<>();
        for(Timetable t  : timetableList){
            String hourFrom = t.getHourFromInDoubleDigitFormatWithMinutes();
            String hourTo = t.getHourToInDoubleDigitFormatWithMinutes();
            FilteredTimetable filteredTimetable = new FilteredTimetable(t.getSubject().getName(), t.getProfessor().getName(),
                    t.getStudentgroup(), t.getRoom(), hourFrom, hourTo, t.getDay());
            filteredTimetableList.add(filteredTimetable);
        }
        return filteredTimetableList;
    }
}
