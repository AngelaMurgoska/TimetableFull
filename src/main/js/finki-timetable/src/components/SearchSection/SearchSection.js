import React, {Component} from 'react';
import {Row, Form, Col, Dropdown} from "react-bootstrap";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";
import Button from "react-bootstrap/Button";
import SearchInput from "../SearchField/SearchField";

class SearchSection extends Component{

    constructor(props,context) {
        super(props, context);
        this.state={
            professors: [],
            rooms: [],
            studentGroups: [],
            selectedProfessor: "",
            selectedRoom: "",
            selectedStudentGroup: ""
        };
        this.handleProfessorChange=this.handleProfessorChange.bind(this);
        this.handleRoomChange=this.handleRoomChange.bind(this);
        this.handleStudentGroupChange=this.handleStudentGroupChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    componentDidMount() {
        GeneralFinkiTimetableApi.fetchAllProfessors().then(data => {
            let professorsFromApi=data.data.map(professor=>{
                return { value:professor.id, label: professor.name }
            });
            this.setState({
               professors: professorsFromApi
            })
        })
        GeneralFinkiTimetableApi.fetchAllRooms().then(data => {
            let roomsFromApi=data.data.map(room=>{
                return { value: room, label: room }
            });
            this.setState({
                rooms: roomsFromApi
            })
        })
        GeneralFinkiTimetableApi.fetchAllStudentGroups().then(data => {
            let studentGroupsFromApi = data.data.map(studentGroup => {
                return {value: studentGroup, label: studentGroup}
            });
            this.setState({studentGroups: studentGroupsFromApi})
        })
    }

    handleProfessorChange(professor) {
        professor ? this.setState({selectedProfessor: professor.value}) : this.setState({selectedProfessor: ""})
    }

    handleRoomChange(room){
        room ? this.setState({selectedRoom: room.value}) : this.setState({selectedRoom: ""})
    }

    handleStudentGroupChange(studentGroup) {
        studentGroup ? this.setState({selectedStudentGroup: studentGroup.value}) : this.setState({selectedStudentGroup: ""})
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.selectedProfessor!=="" || this.state.selectedRoom!=="" || this.state.selectedStudentGroup !== "")
         this.props.populateFilteredTimetable(this.state.selectedProfessor,this.state.selectedRoom, this.state.selectedStudentGroup);
    }

    render() {
        return (
            <div className={"mb-4"}>
                <h4 className={"mb-3 "}>Опции за филтрирање</h4>
                <Form onSubmit={this.handleSubmit}>
                    <Row className={"align-items-center"}>
                        <Col>
                            <SearchInput isClearable = {true} onChangeMethod = {this.handleProfessorChange} searchPlaceholder = "Изберете професор" searchData = {this.state.professors}/>
                        </Col>
                        <Col>
                            <SearchInput isClearable = {true} onChangeMethod = {this.handleRoomChange} searchPlaceholder = "Изберете просторија" searchData = {this.state.rooms}/>
                        </Col>
                        <Col>
                            <SearchInput isClearable = {true} onChangeMethod = {this.handleStudentGroupChange} searchPlaceholder = "Изберете група" searchData = {this.state.studentGroups}/>
                        </Col>
                        <Col>
                            <Button  variant="primary" type="submit">Пребарај</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }

}

export default SearchSection;