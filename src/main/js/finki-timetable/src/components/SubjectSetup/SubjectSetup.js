import React, {Component} from 'react';
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";
import {Button, Col, Form, FormLabel, Row} from "react-bootstrap";
import Section from "../Section/Section";
import Table from "react-bootstrap/Table";
import {Redirect} from "react-router-dom";
import SearchInput from "../SearchInput/SearchInput";

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
            subjectSelections: [],
            selectionInvalid: false
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
            let subjectsFromApi = data.data.map(subject => {
                return {value: subject.id, label: subject.name}
            });
            this.setState({subjects: subjectsFromApi})
        });
        FinkiTimetableService.fetchAllProfessors().then((data) => {
            let professorsFromApi=data.data.map(professor=>{
                return { value:professor.id, label: professor.name }
            });
            this.setState({
                professors: professorsFromApi, assistants: [{value: "", label: "Нема асистент по предметот"}].concat(professorsFromApi)
            });
        });
        FinkiTimetableService.fetchAllStudentGroups().then((data) => {
            let studentGroupsFromApi  = data.data.map(studentGroup => {
                return {value: studentGroup, label:studentGroup}
            });
            this.setState({studentGroups: studentGroupsFromApi})
        })
    }

    handleSubjectChange(subject) {
        subject ? this.setState({selectedSubject: subject}) : this.setState({selectedSubject: ""})
    }

    handleProfessorChange(professor) {
        professor ? this.setState({selectedProfessor: professor}) : this.setState({selectedProfessor: ""})
    }

    handleAssistantChange(assistant) {
        assistant ? this.setState({selectedAssistant: assistant}) : this.setState({selectedAssistant: ""})
    }

    handleGroupChange(studentGroup) {
        studentGroup ? this.setState({selectedStudentGroup: studentGroup}) : this.setState({selectedStudentGroup: ""})
    }

    //check for duplicates
    addSubjectSelection(e) {
        if (this.state.selectedProfessor !== '' && this.state.selectedSubject !== '' && this.state.selectedStudentGroup !== '') {
            FinkiTimetableService.validateSubjectSelection(this.state.selectedProfessor.value, this.state.selectedSubject.value, this.state.selectedStudentGroup.value).then(response => {
                if (response.data) {
                    if (this.state.selectedAssistant !== "" && this.state.selectedAssistant.value !== '') {
                        FinkiTimetableService.validateSubjectSelection(this.state.selectedAssistant.value, this.state.selectedSubject.value, this.state.selectedStudentGroup.value).then(response => {
                            if (response.data) {
                                if (this.state.subjectSelections.some(selection => selection.subjectId === this.state.selectedSubject.value && selection.professorId === this.state.selectedProfessor.value && selection.assistantId === this.state.selectedAssistant.value && selection.group === this.state.selectedStudentGroup.value) === false){
                                    this.setState((prevState) => ({
                                        subjectSelections: [...prevState.subjectSelections, {
                                            "subjectId": this.state.selectedSubject.value,
                                            "professorId": this.state.selectedProfessor.value,
                                            "assistantId": this.state.selectedAssistant.value,
                                            "group": this.state.selectedStudentGroup.value
                                        }], selectionInvalid: false
                                    }))
                                }
                            } else {
                                this.setState({selectionInvalid: true})
                            }
                        })
                    } else {
                        if (this.state.subjectSelections.some(selection => selection.subjectId === this.state.selectedSubject.value && selection.professorId === this.state.selectedProfessor.value && selection.assistantId === this.state.selectedAssistant.value && selection.group === this.state.selectedStudentGroup.value) === false){
                            this.setState((prevState) => ({
                                subjectSelections: [...prevState.subjectSelections, {
                                    "subjectId": this.state.selectedSubject.value,
                                    "professorId": this.state.selectedProfessor.value,
                                    "assistantId": this.state.selectedAssistant.value,
                                    "group": this.state.selectedStudentGroup.value
                                }], selectionInvalid: false
                            }))
                        }
                    }
                } else {
                    this.setState({selectionInvalid: true})
                }
            })
        }
    }

    deleteSubjectSelection(index) {
        const selectedSubjects = [...this.state.subjectSelections]
        selectedSubjects.splice(index, 1)
        this.setState({subjectSelections: selectedSubjects})
    }

    //TODO add alert
    createTimetableFromSelection(e) {
        FinkiTimetableService.createStudentTimetable(this.props.studentindex, this.state.subjectSelections).catch((error) => {
            console.log(error.response)
        })
        return <Redirect to='/'/>;
    }

    render() {
        return (
         <React.Fragment>

         <Section>
             <Row className={"align-items-end"}>
                 <Col className={"pb-0"}>
                     <FormLabel>Предмет</FormLabel>
                     <SearchInput searchPlaceholder = {"Изберете предмет"} isClearable = {false} onChangeMethod={this.handleSubjectChange} searchData={this.state.subjects}/>
                 </Col>
                 <Col>
                     <FormLabel>Професор</FormLabel>
                     <SearchInput searchPlaceholder = {"Изберете професор"} isClearable = {false} onChangeMethod = {this.handleProfessorChange} searchData = {this.state.professors}/>
                 </Col>
                 <Col>
                     <FormLabel>Асистент</FormLabel>
                     <SearchInput searchPlaceholder = {"Изберете асистент"} isClearable = {false} onChangeMethod = {this.handleAssistantChange} searchData = {this.state.assistants}/>
                 </Col>
                 <Col>
                     <FormLabel>Група</FormLabel>
                     <SearchInput searchPlaceholder = {"Изберете група"} isClearable = {false} onChangeMethod = {this.handleGroupChange} searchData = {this.state.studentGroups}/>
                 </Col>
                 <Col>
                     <Button onClick={this.addSubjectSelection} variant="success">Додај</Button>
                 </Col>
             </Row>
             {this.state.selectionInvalid && <div className={"mt-2 text-danger"}>Не постои податок во распоредот за ваква селекција.</div>}
         </Section>
         {this.state.subjectSelections.length > 0 &&
         <div className={"mt-4"}>
             <Section>
                 <h4>Избрани предмети</h4>
                 <Table className={"mr-5"}>
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
                         <FormLabel>{this.state.subjects.find((subject) => subject.value == selection.subjectId).label}</FormLabel>
                     </td>
                     <td>
                         <FormLabel>{this.state.professors.find((professor) => professor.value == selection.professorId).label}</FormLabel>
                     </td>
                     <td>
                         <FormLabel>{selection.assistantId && this.state.professors.find((professor) => professor.value == selection.assistantId).label}</FormLabel>
                     </td>
                     <td>
                         <FormLabel>{selection.group}</FormLabel>
                     </td>
                     <td className={"text-right"}>
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