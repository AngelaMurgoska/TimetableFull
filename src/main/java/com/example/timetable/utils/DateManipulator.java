package com.example.timetable.utils;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class DateManipulator {

    public static LocalDate returnClosestWeekdayFromDate(LocalDate date) {
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY) {
            return date.plusDays(2);
        } else if (date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return date.plusDays(1);
        } else {
            return  date;
        }
    }
}
