import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import ServerAPI from '../ServerAPI';
import axios from 'axios';


function FieldGroup({ id,status,label,help, ...props }) {
    return (
        <FormGroup controlId={id} validationState={status}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props}/>
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
};

//I dont know it need or not
let csvJSON = function(csv) {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");

    for(let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(",");
        for(let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return JSON.stringify(result);
};
//




class AddJob extends Component {
    getInitialState() {

    }

    constructor() {
        super();
        this.state = {
            open: false,
            status: {
                name: null,
                source1: null,
                source2: null,
                selectedFields: null,
                metric: null,
                outputFileName: null
            },
            isLoading: false,
            metrics: null,
            jobToServer: {}
        };
        this.handleClick = this.handleClick.bind(this);
        this.loadFile = this.loadFile.bind(this);
        this.checkAndSend = this.checkAndSend.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    };

    componentWillMount() {
        let self = this;
        axios.get('/metrics')
            .then(function(response){
                self.setState({
                    metrics: response.data
                                .map((metric) => <option key={metric} value={metric}>{metric}</option>)
                });
            })
    };

    loadFile(fileClass) {
        let self = this;
        let reader = new FileReader();

        reader.onload = function(event) {       
            fileClass.id === "firstSource" ? self.setState({ source1 : event.target.result }) 
                : self.setState({ source2 : event.target.result });
        }
        if(fileClass.files[0]) {
            reader.readAsText(fileClass.files[0]);
        } else {
            fileClass.id === "firstSource" ? this.setState({ source1 : "notLoad" }) 
                : this.setState({ source2 : "notLoad" });
        }
    }

    checkAndSend() {
        let self = this;
        let allContain = true;
        let status = {};
        for(let key in this.state.jobToServer) {
            if(this.state.jobToServer.hasOwnProperty(key)) {
                let value = this.state.jobToServer[key];
                if(!value || value === "" || value === "notLoad") {
                    status[key] = "error";
                    allContain = false;
                } else {
                    status[key] = null;
                }
            }
        }
        this.setState({
            status: status 
        });
        console.log(self.state.jobToServer);
        allContain ? axios.post('\jobs', self.state.jobToServer)
                        .then(function(response) {
                            console.log(response);
                            self.setState({isLoading: false})
                        })
            : this.setState({ isLoading : false }); 
    }

    handleClick() {
        this.setState({
            isLoading: true,
        });
        this.loadFile(document.getElementById("firstSource"));
        this.loadFile(document.getElementById("secondSource"));
        //Loading occurs in assynchronous thread, so we need to wait
        let loadingTimer = setInterval(function() {
            if((this.state.source1 && this.state.source2) 
                || this.state.source1 === "notLoad" || this.state.source2 === "notLoad") {
                clearInterval(loadingTimer);
                this.setState({
                    jobToServer: {
                        name: document.getElementById("jobName").value,
                        source1: this.state.source1,
                        source2: this.state.source2,
                        selectedFields: document.getElementById("selectedFields").value,
                        metric: document.getElementById("selectMetric").value,
                        outputFileName: document.getElementById("outputFileName").value
                    }
                });
                this.checkAndSend();
            }
        }.bind(this),500);
    };

    render() {
        return (
            <div>
                <Button onClick={() => this.setState({ open: !this.state.open })}>
                        Add job
                </Button>
                <Panel collapsible expanded={this.state.open}>
                    <form>
                        <FieldGroup
                            id="jobName"
                            status={this.state.status.name}
                            type="text"
                            label="Jobs name"
                            placeholder="Enter name"        
                        />
                        <FieldGroup
                            id="firstSource"
                            status={this.state.status.source1}
                            type="file"
                            label="First source file"
                        />
                        <FieldGroup
                            id="secondSource"
                            status={this.state.status.source2}
                            type="file"
                            label="Second source file"
                        />
                        <FormGroup controlId="selectedFields" validationState={this.state.status.selectedFields}>
                            <ControlLabel>Selected fields (name1, name2, ...)</ControlLabel>
                            <FormControl componentClass="textarea" placeholder="Enter names"/>
                        </FormGroup>
                        <FormGroup controlId="selectMetric" validationState={this.state.status.metric}>
                            <ControlLabel>Choose metric</ControlLabel>
                            <FormControl componentClass="select" placeholder="...">
                                {this.state.metrics}
                            </FormControl>
                        </FormGroup>
                        <FieldGroup
                            id="outputFileName"
                            status={this.state.status.outputFileName}
                            type="text"
                            label="Output filename"
                            placeholder="Filename"
                        />
                        <Button
                            bsStyle="success"
                            type="submit"
                            disabled={this.state.isLoading}
                            onClick={!this.state.isLoading ? this.handleClick : null}>
                            {this.state.isLoading ? 'Loading...' : 'Send job to server'}
                        </Button>
                    </form>
                </Panel>
            </div>
        );
    }
}

export default AddJob;