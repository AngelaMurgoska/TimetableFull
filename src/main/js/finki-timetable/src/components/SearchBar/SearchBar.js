import React, {Component} from 'react';
import {Row, Form, Col, Dropdown} from "react-bootstrap";
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";
import Button from "react-bootstrap/Button";


class SearchBar extends Component{

    constructor(props,context) {
        super(props, context);
        this.state={
            professors: [],
            rooms: [],
            selectedProfessor: "",
            selectedRoom: "",
        };
        this.handleProfessorChange=this.handleProfessorChange.bind(this);
        this.handleRoomChange=this.handleRoomChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    componentDidMount() {
        FinkiTimetableService.fetchAllProfessors().then(data => {
            let professorsFromApi=data.data.map(professor=>{
                return { value:professor.id, display: professor.name }
            });
            this.setState({
               professors: [{value: '', display: 'Изберете професор'}].concat(professorsFromApi)
            })
        })
        FinkiTimetableService.fetchAllRooms().then(data => {
            let roomsFromApi=data.data.map(room=>{
                return { value: room, display: room }
            });
            this.setState({
                rooms: [{value: '', display: 'Изберете просторија'}].concat(roomsFromApi)
            })
        })
    }

    handleProfessorChange(e){
        this.setState({selectedProfessor: e.target.value})
    }

    handleRoomChange(e){
        this.setState({selectedRoom: e.target.value})
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.selectedProfessor!=="" || this.state.selectedRoom!=="")
         this.props.populateFilteredTimetable(this.state.selectedProfessor,this.state.selectedRoom);
    }

    render() {
        return (
            <div>
                <h4>Опции за филтрирање</h4>
                <Row>
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Control as="select" value={this.state.selectedProfessor} onChange={this.handleProfessorChange} className={"my-1"}>
                                    {this.state.professors.map((professor) => <option key={professor.value} value={professor.value}>{professor.display}</option>)}
                                </Form.Control>
                                <Form.Control as="select" value={this.state.selectedRoom}  onChange={this.handleRoomChange} className={"my-1"}>
                                    {this.state.rooms.map((room) => <option key={room.value} value={room.value}>{room.display}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">Пребарај</Button>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </div>
        )
    }

}

export default SearchBar;