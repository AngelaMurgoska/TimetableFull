import React,{Component} from "react";
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";

class TimetableUpload extends Component{

    constructor(props) {
        super(props);
        this.state ={
            file:null,
            visibility: {
                formClass: "d-none",
                shouldHide: true,
            },
            semesterType: "",
            semesterAcademicYear: "",
            message: ""
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.changeVisibility=this.changeVisibility.bind(this);
        this.semesterTypeChange=this.semesterTypeChange.bind(this);
        this.semesterAcademicYearChange=this.semesterAcademicYearChange.bind(this);
    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        let type=this.state.semesterType;
        let academicYear=this.state.semesterAcademicYear;
        let message=this.state.message;

        if(this.state.visibility.shouldHide){
            type=academicYear=message="";
        }

        if(this.state.file!=null && message===""){
            FinkiTimetableService.uploadFile(this.state.file,type,academicYear);
        }

    }

    onChange(e) {
        this.setState({file:e.target.files[0]});
    }

    semesterTypeChange(e){
        this.setState({semesterType: e.target.value})
    }

    semesterAcademicYearChange(e){
        if(e.target.value.match("^2[0-9]{3}/2[0-9]{3}$") != null) {
            this.setState({semesterAcademicYear: e.target.value})
            this.setState({message: ""})
        }
        else this.setState({message: "невалиден формат на година"})
    }

    changeVisibility(e) {
        this.setState((prevState) => {
                let visibility = {...prevState.visibility};
                visibility.shouldHide = !prevState.visibility.shouldHide;
                visibility.formClass = visibility.shouldHide ? "d-none" : "";
                return {visibility};
            }
        );
    }


    render() {
        return(
            <React.Fragment>
                <form  onSubmit={this.onFormSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="file">Upload на нова верзија .csv формат</label>
                        <input onChange={this.onChange} type="file" className="form-control-file small" id="file" accept=".csv"/>
                    </div>
                    <div className="form-check">
                        <input onChange={this.changeVisibility} className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                            <label className="form-check-label" htmlFor="defaultCheck1">
                                Нов семестар
                            </label>
                    </div>
                    <div className={this.state.visibility.formClass} >
                        <div onChange={this.semesterTypeChange}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                                       value="0"/>
                                <label className="form-check-label" htmlFor="inlineRadio1">летен</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                       value="1"/>
                                <label className="form-check-label" htmlFor="inlineRadio2">зимски</label>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="academicYear" className={"pr-2"}>Академска година</label>
                            <input onChange={this.semesterAcademicYearChange} id="academicYear" type="text" placeholder={"пр. 2017/2018"}/>
                            <div className={"mt-1"}><small className={"text-danger"}>{this.state.message}</small></div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Прикачи распоред</button>
                </form>
            </React.Fragment>
        )
    }
}
export default TimetableUpload;