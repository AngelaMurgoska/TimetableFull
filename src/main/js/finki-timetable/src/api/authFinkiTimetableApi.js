import axios,{ post } from 'axios';

const AuthFinkiTimetableApi = {
    loginUser: (user) => {
      const url = 'http://localhost:8080/login';
      const config = {
            headers: {
                'content-type': 'application/json',
            }
      }
      return axios.post(url, user, config)
    },

    registerStaffUser: (user) => {
        const url='http://localhost:8080/auth/register/staff';
        const config = {
            headers: {
                'content-type': 'application/json',
            }}
        return axios.post(url,user, config);
    },

    registerStudentUser: (studentUser) => {
        const url='http://localhost:8080/auth/register/student';
        const config = {
            headers: {
                'content-type': 'application/json',
            }}
        return axios.post(url,studentUser, config);
    },

    fetchLoggedInUserInfo:(email) => {
        const jwtToken = sessionStorage.getItem("jwt");
        return axios.get(`http://localhost:8080/timetable/studentemail/${email}`,
            {headers: {"Authorization": jwtToken }})
    },

    fetchLoggedInUserRole:(username)=>{
        const jwtToken = sessionStorage.getItem("jwt");
        return axios.get(`http://localhost:8080/auth/role/${username}`,
            {headers: {"Authorization": jwtToken }}
        )
    }
}

export default AuthFinkiTimetableApi;