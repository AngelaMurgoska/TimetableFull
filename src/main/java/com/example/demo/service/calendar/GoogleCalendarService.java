package com.example.demo.service.calendar;

import com.example.demo.models.nonEntity.timetables.StudentTimetable;
import com.example.demo.utils.StringManipulator;
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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "Timetable";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    /**
     * Global instance of the scopes required by this quickstart.
     * If modifying these scopes, delete your previously saved tokens/ folder.
     */
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);
    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";

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

    //TODO fix timezone
    public void testExampleEvents() throws GeneralSecurityException, IOException {
// Build a new authorized API client service.
       Calendar service = setupCalendarService();

        Event event = new Event()
                .setSummary("Google I/O 2015")
                .setDescription("A chance to hear more about Google's developer products.");

        DateTime startDateTime = new DateTime("2020-06-28T08:00:00+02:00");
        EventDateTime start = new EventDateTime()
                .setDateTime(startDateTime)
                .setTimeZone("Europe/Skopje");
        event.setStart(start);

        DateTime endDateTime = new DateTime("2020-06-28T17:00:00+02:00");
        EventDateTime end = new EventDateTime()
                .setDateTime(endDateTime)
                .setTimeZone("Europe/Skopje");
        event.setEnd(end);

        String calendarId = "primary";
        event = service.events().insert(calendarId, event).execute();
        System.out.printf("Event created: %s\n", event.getHtmlLink());
    }

    public void addStudentTimetableToGoogleCalendar(List<StudentTimetable> studentTimetables) throws GeneralSecurityException, IOException {
        Calendar service = setupCalendarService();

        for (StudentTimetable studentTimetableEvent : studentTimetables) {
            Event event = new Event()
                    .setSummary(studentTimetableEvent.getSubjectName())
                    .setDescription("A sample class event");
            String classStartTime = studentTimetableEvent.getStartTime();
            String classEndTime = studentTimetableEvent.getEndTime();

            /*in the database, time before 10 is written as 9 instead of 09*/
            if (classStartTime.length() < 4) {
                classStartTime = StringManipulator.addLeadingZeroToNumber(classStartTime);
            }
            if (classEndTime.length() < 4) {
                classEndTime = StringManipulator.addLeadingZeroToNumber(classEndTime);
            }
            String startTimeString =  "2020-07-28T" + classStartTime + ":00+02:00";
            DateTime startDateTime = new DateTime(startTimeString);
            EventDateTime start = new EventDateTime()
                    .setDateTime(startDateTime)
                    .setTimeZone("Europe/Skopje");
            String endTimeString = "2020-07-28T" + classEndTime + ":00+02:00";
            DateTime endDateTime = new DateTime(endTimeString);
            EventDateTime end = new EventDateTime()
                    .setDateTime(endDateTime)
                    .setTimeZone("Europe/Skopje");
            event.setStart(start);
            event.setEnd(end);
            String[] recurrence = new String[] {"RRULE:FREQ=WEEKLY;COUNT=2"};
            event.setRecurrence(Arrays.asList(recurrence));
            String calendarId = "primary";
            event = service.events().insert(calendarId, event).execute();
            System.out.printf("Event with id %s created: %s\n", event.getId(), event.getHtmlLink());
            //service.events().delete("primary", event.getId()).execute();
        }
    }

}
