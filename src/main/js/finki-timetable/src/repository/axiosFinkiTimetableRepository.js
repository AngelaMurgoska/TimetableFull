import axios,{ post } from 'axios';

const FinkiTimetableService = {

    addTimetableToGoogleCalendar:(index) => {
        const jwtToken = sessionStorage.getItem("jwt");
        const url = `http://localhost:8080/timetable/add-to-calendar/${index}`;
        const config = {
            headers: {
                "Authorization": jwtToken
            },
        }
        return axios.post(url,null, config);
    },

    uploadFile:(file,semesterType,academicYear) =>{
        const jwtToken = sessionStorage.getItem("jwt");
        const url = 'http://localhost:8080/timetable/upload-timetable';
        const formData = new FormData();
        formData.append('file',file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                "Authorization": jwtToken
            },
            params: {
                ...(semesterType ? { semesterType: semesterType } : {}),
                ...(academicYear ? { academicYear: academicYear } : {}),
            }
        }
        return  post(url, formData,config)
    },

    fetchAllProfessors: ()=>{
      const url='http://localhost:8080/timetable/professors';
      return axios.get(url,);
    },

    fetchAllRooms: ()=>{
        const url='http://localhost:8080/timetable/rooms';
        return axios.get(url);
    },

    fetchStudentInfo:(index)=>{
        const jwtToken = sessionStorage.getItem("jwt");
        return axios.get(`http://localhost:8080/timetable/${index}`,{headers: {"Authorization": jwtToken }});
    },

    fetchStudentTimetableForDay: (index,day)=>{
        const jwtToken = sessionStorage.getItem("jwt");
        const username=sessionStorage.getItem("username");
        if(username!==index){
            //a way of authorization, not good enough
        }
        return axios.get(`http://localhost:8080/timetable/student/${index}/${day}`,{headers: {"Authorization": jwtToken }});
    },

    fetchFilteredTimetableForDay: (day,professorId,room) =>{
        return axios.get(`http://localhost:8080/timetable/filter/${day}`,{
            params: {
                ...(professorId ? { professorId: professorId } : {}),
                ...(room ? { room: room } : {}),
            },
        })
    },

    fetchLoggedInUserRole:(username)=>{
        const jwtToken = sessionStorage.getItem("jwt");
        return axios.get(`http://localhost:8080/auth/role/${username}`,
            {headers: {"Authorization": jwtToken }}
        )
    }

}

export default FinkiTimetableService;