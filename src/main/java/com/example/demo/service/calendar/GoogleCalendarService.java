package com.example.demo.service.calendar;

import com.example.demo.models.CalendarEvent;
import com.example.demo.models.Semester;
import com.example.demo.models.Student;
import com.example.demo.models.nonEntity.timetables.StudentTimetable;
import com.example.demo.service.SemesterService;
import com.example.demo.service.StudentService;
import com.example.demo.service.impl.StudentServiceImpl;
import com.example.demo.utils.DateManipulator;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleCalendarService {

    private StudentService studentService;
    private SemesterService semesterService;

    private static final String APPLICATION_NAME = "Timetable";

    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    /**
     * Global instance of the scopes required by this quickstart.
     * If modifying these scopes, delete your previously saved tokens/ folder.
     */
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);

    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";

    public GoogleCalendarService(StudentService studentService, SemesterService semesterService) {
        this.studentService = studentService;
        this.semesterService = semesterService;
    }

    /**
     * Creates an authorized Credential object.
     * @param HTTP_TRANSPORT The network HTTP Transport.
     * @return An authorized Credential object.
     * @throws IOException If the credentials.json file cannot be found.
     */
    private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        // Load client secrets.
        InputStream in = GoogleCalendarService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // Build flow and trigger user authorization request.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8080).build();
        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }

    private Calendar setupCalendarService() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public void addStudentTimetableToGoogleCalendar(List<StudentTimetable> studentTimetables) throws GeneralSecurityException, IOException {
        //TODO handle it in a better way on frontend
        if (studentTimetables == null) {
            return;
        }

        Calendar service = setupCalendarService();

        Semester currentSemester = semesterService.getLatestSemester();

        Long studentIndex = studentTimetables.get(0).getStudentindex();
        Student currentStudent = studentService.getByStuIndex(studentIndex);

        List<CalendarEvent> currentEventsInStudentCalendar = studentService.getAllCalendarEventsFromStudent(currentStudent);
        removeEventsFromGoogleCalendar(currentEventsInStudentCalendar);
        studentService.deleteCurrentCalendarEventsFromStudent(currentStudent);

        List<String> eventIds = new ArrayList<>();
        LocalDate semesterStartDate =  currentSemester.getStartDate();
        LocalDate baseDate;
        baseDate = DateManipulator.returnClosestWeekdayFromDate(semesterStartDate);
        LocalDate classDate;

        for (StudentTimetable studentTimetableEvent : studentTimetables) {
            Event event = new Event().setSummary(studentTimetableEvent.getSubjectName());
            String classStartTime = studentTimetableEvent.getStartTimeInDoubleDigitFormat();
            String classEndTime = studentTimetableEvent.getEndTimeInDoubleDigitFormat();

            int classDayDifferenceFromBaseDate = Math.toIntExact(studentTimetableEvent.getDay()) - baseDate.getDayOfWeek().getValue();

            if (classDayDifferenceFromBaseDate > 0) {
                classDate = baseDate.plusDays(classDayDifferenceFromBaseDate);
            } else {
                classDate = baseDate.minusDays(Math.abs(classDayDifferenceFromBaseDate));
            }

            String startTimeString =  classDate + "T" + classStartTime + ":00+01:00";
            DateTime startDateTime = new DateTime(startTimeString);
            EventDateTime start = new EventDateTime().setDateTime(startDateTime).setTimeZone("Europe/Skopje");
            String endTimeString = classDate + "T" + classEndTime + ":00+01:00";
            DateTime endDateTime = new DateTime(endTimeString);
            EventDateTime end = new EventDateTime().setDateTime(endDateTime).setTimeZone("Europe/Skopje");
            event.setStart(start);
            event.setEnd(end);

            //until: the date when the semester is supposed to end, on midnight
            //TODO what does the Z mean at the end
            LocalDate semesterEndDate = currentSemester.getEndDate();
            String semesterEndDateString = semesterEndDate.toString();
            semesterEndDateString = semesterEndDateString.replaceAll("-", "");
            String[] recurrence = new String[] {"RRULE:FREQ=WEEKLY;UNTIL=" + semesterEndDateString + "T000000Z"};
            event.setRecurrence(Arrays.asList(recurrence));
            String calendarId = "primary";
            event = service.events().insert(calendarId, event).execute();
            System.out.printf("Event with id %s created: %s\n", event.getId(), event.getHtmlLink());

            eventIds.add(event.getId());
        }
        studentService.saveTimetableCalendarEventsForStudent(currentStudent, eventIds);
    }

    public void removeEventsFromGoogleCalendar(List<CalendarEvent> events) throws GeneralSecurityException, IOException {
        Calendar service = setupCalendarService();
        if (events != null) {
            for (CalendarEvent event : events) {
                Event oldEvent = service.events().get("primary", event.getEventId()).execute();
                if (oldEvent != null && !oldEvent.getStatus().equals("cancelled")) {
                    service.events().delete("primary", event.getEventId()).execute();
                }
            }
        }
    }

}
