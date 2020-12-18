import React, {Component} from 'react';
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import Section from "../Section/Section";
import Table from "react-bootstrap/Table";

class SubjectSetup extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            subjects:[],
            selectedSubject: '',
            professors: [],
            //TODO change this, it's not neccesary to have the same array twice
            assistants: [],
            selectedProfessor: '',
            selectedAssistant: '',
            studentGroups: [],
            selectedStudentGroup: '',
            subjectSelections: []
        }
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.handleProfessorChange = this.handleProfessorChange.bind(this);
        this.handleAssistantChange = this.handleAssistantChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.addSubjectSelection = this.addSubjectSelection.bind(this);
        this.deleteSubjectSelection = this.deleteSubjectSelection.bind(this);
        this.createTimetableFromSelection = this.createTimetableFromSelection.bind(this);
    }

    componentDidMount() {
        FinkiTimetableService.fetchAllSubjects().then((data) => {
            this.setState({subjects: data.data, selectedSubject: data.data[0].id})
        })
        FinkiTimetableService.fetchAllProfessors().then((data) => {
            this.setState({professors: data.data, assistants: [{id: "", name: 'Нема вежби по предметот'}].concat(data.data), selectedProfessor: data.data[0].id}
            )
        })
        FinkiTimetableService.fetchAllStudentGroups().then((data) => {
            this.setState({studentGroups: data.data, selectedStudentGroup: data.data[0]})
        })
    }

    handleSubjectChange(e) {
        this.setState({selectedSubject: e.target.value})
    }

    handleProfessorChange(e) {
        this.setState({selectedProfessor: e.target.value})
    }

    handleAssistantChange(e) {
        this.setState({selectedAssistant: e.target.value})
    }

    handleGroupChange(e) {
        this.setState({selectedStudentGroup: e.target.value})
    }

    addSubjectSelection(e) {
        if (this.state.selectedProfessor !== '' && this.state.selectedSubject !== '' && this.state.selectedStudentGroup !== '') {
            this.setState((prevState) => ({subjectSelections: [...prevState.subjectSelections, {"subjectId" : this.state.selectedSubject, "professorId" : this.state.selectedProfessor, "assistantId" : this.state.selectedAssistant, "group" : this.state.selectedStudentGroup}]}))
        }
    }

    deleteSubjectSelection(index) {
        const selectedSubjects = [...this.state.subjectSelections]
        selectedSubjects.splice(index, 1)
        this.setState({subjectSelections: selectedSubjects})
    }

    createTimetableFromSelection(e) {
        FinkiTimetableService.createStudentTimetable(this.props.studentindex, this.state.subjectSelections).catch((error) => {
            console.log(error.response)
        })
    }

    render() {
        return (
         <React.Fragment>

         <Section>
             <Row className={"align-items-end"}>
                 <Col className={"pb-0"}>
                     <FormLabel>Предмет</FormLabel>
                     <Form.Control as="select" value={this.state.selectedSubject} onChange={this.handleSubjectChange}>
                         {this.state.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                     </Form.Control>
                 </Col>
                 <Col>
                     <FormLabel>Професор</FormLabel>
                     <Form.Control as="select" value={this.state.selectedProfessor} onChange={this.handleProfessorChange}>
                         {this.state.professors.map((professor) => <option key={professor.id} value={professor.id}>{professor.name}</option>)}
                     </Form.Control>
                 </Col>
                 <Col>
                     <FormLabel>Асистент</FormLabel>
                     <Form.Control as="select" value={this.state.selectedAssistant} onChange={this.handleAssistantChange}>
                         {this.state.assistants.map((assistant) => <option key={assistant.id} value={assistant.id}>{assistant.name}</option>)}
                     </Form.Control>
                 </Col>
                 <Col>
                     <FormLabel>Група</FormLabel>
                     <Form.Control as="select" value={this.state.selectedStudentGroup} onChange={this.handleGroupChange}>
                         {this.state.studentGroups.map((group) => <option key={group} value={group}>{group}</option>)}
                     </Form.Control>
                 </Col>
                 <Col>
                     <Button onClick={this.addSubjectSelection} variant="success">Додај</Button>
                 </Col>
             </Row>
         </Section>
         {this.state.subjectSelections.length > 0 &&
         <div className={"mt-4"}>
             <Section>
                 <h4>Избрани предмети</h4>
                 <Table>
                     <thead>
                     <tr>
                         <th>Предмет</th>
                         <th>Професор</th>
                         <th>Асистент</th>
                         <th>Група</th>
                         <th></th>
                     </tr>
                     </thead>
                 <tbody>
                 {this.state.subjectSelections.map((selection) =>
                 <tr>
                     <td>
                         <FormLabel>{this.state.subjects.find((subject) => subject.id == selection.subjectId).name}</FormLabel>
                     </td>
                     <td>
                         <FormLabel>{this.state.professors.find((professor) => professor.id == selection.professorId).name}</FormLabel>
                     </td>
                     <td>
                         <FormLabel>{selection.assistantId && this.state.professors.find((professor) => professor.id == selection.assistantId).name}</FormLabel>
                     </td>
                     <td>
                         <FormLabel>{selection.group}</FormLabel>
                     </td>
                     <td>
                         <Button onClick={() => this.deleteSubjectSelection(this.state.subjectSelections.indexOf(selection))} variant="danger">Отстрани</Button>
                     </td>
                 </tr>
                 )}
                 </tbody>
                </Table>
                <Button onClick={this.createTimetableFromSelection} className={"float-right mt-2"} variant={"success"}>Додај предмети во распоред</Button>
             </Section>
         </div> }
         </React.Fragment>
        )
    }

}

export default SubjectSetup;