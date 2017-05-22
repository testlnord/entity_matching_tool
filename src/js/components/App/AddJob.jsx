import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { browserHistory } from 'react-router';
import ListJobs from './ListJobs';
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

class AddJob extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            status: {
                name: null,
                source1: null,
                source2: null,
                firstSelectedFields: null,
                secondSelectedFields: null,
                metric: null,
                outputFileName: null
            },
            isLoading: false,
            metrics: null,
            listPaths: null,
            firstFields: null,
            secondFields: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.refreshFirstFields = this.refreshFirstFields.bind(this);
        this.refreshSecondFields = this.refreshSecondFields.bind(this);
    };

    componentWillMount() {
        let self = this;
        axios.get('/metrics/')
            .then(function(response) {
                self.setState({
                    metrics: response.data
                                .map((metric) => <option key={metric} value={metric}>{metric}</option>)
                });
            });
        axios.get('/csvfiles/')
            .then(function(response) {
                self.setState({
                    listPaths: response.data
                                .map((path) => <option key={path} value={path}>{path}</option>)
                });
            });
    };

   

    handleClick() {
        this.setState({
            isLoading: true,
        });
        this.setState({
            jobToServer: {
                name: document.getElementById("jobName").value,
                source1: document.getElementById("firstSource").value,
                source2: document.getElementById("secondSource").value,
                selectedFields: {source1: document.getElementById("firstSelectedFields").value, 
                                    source2: document.getElementById("secondSelectedFields").value},
                metric: document.getElementById("selectMetric").value,
                outputFileName: document.getElementById("outputFileName").value
            } 
        });
        let self = this;
        let loadingTimer = setInterval(function() {
            if(self.state.jobToServer) {
                clearInterval(loadingTimer);
                let allContain = true;
                let status = {};
                for(let key in self.state.jobToServer) {
                    if(self.state.jobToServer.hasOwnProperty(key)) {
                        let value = self.state.jobToServer[key];
                        if(!value || value === "") {
                            status[key] = "error";
                            allContain = false;
                        } else {
                            status[key] = null;
                        }
                    }
                }
                self.setState({
                    status: status 
                });
                allContain ? axios.post('http://' + localStorage.getItem('loginToken') + ':' + '@localhost:5000/jobs/', this.state.jobToServer)
                                .then(function(response) {
                                    document.getElementById("jobName").value = null;
                                    document.getElementById("firstSource").value = null;
                                    document.getElementById("secondSource").value = null;
                                    document.getElementById("firstSelectedFields").value = null;
                                    document.getElementById("secondSelectedFields").value = null;
                                    document.getElementById("selectMetric").value = null;
                                    document.getElementById("outputFileName").value = null;
                                    self.setState({open: !self.state.open, 
                                                isLoading: false});
                                    self.props.callback();
                                })
                    : self.setState({ isLoading : false });
            }
        }.bind(this), 500);
    };

    refreshFirstFields() {
        let self = this;
        let path = document.getElementById("firstSource").value;
        axios.get('/fieldnames/?filePath=' + path)
            .then(function(response) {
                self.setState({
                    firstFields: response.data
                                    .map((name) => <option key={name} value={name}>{name}</option>)
                })
            });
    };

    refreshSecondFields() {
        let self = this;
        let path = document.getElementById("secondSource").value;
        axios.get('/fieldnames/?filePath=' + path)
            .then(function(response) {
                self.setState({
                    secondFields: response.data
                                    .map((name) => <option key={name} value={name}>{name}</option>)
                })
            });
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
                        <FormGroup controlId="firstSource" validationState={this.state.status.source1}>
                            <ControlLabel>Choose first path to csv file</ControlLabel>
                            <FormControl  componentClass="select" onChange={this.refreshFirstFields} 
                                    >
                                {this.state.listPaths}
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="firstSelectedFields" validationState={this.state.status.firstSelectedFields}>
                            <ControlLabel>Selected fields for first file</ControlLabel>
                            <FormControl componentClass="select" multiple>
                                {this.state.firstFields}
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="secondSource" validationState={this.state.status.source2}>
                            <ControlLabel>Choose second path to csv file</ControlLabel>
                            <FormControl  componentClass="select" onChange={this.refreshSecondFields}>
                                {this.state.listPaths}
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="secondSelectedFields" validationState={this.state.status.secondSelectedFields}>
                            <ControlLabel>Selected fields for second file</ControlLabel>
                            <FormControl componentClass="select" multiple>
                                {this.state.secondFields}
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="selectMetric" validationState={this.state.status.metric}>
                            <ControlLabel>Choose metric</ControlLabel>
                            <FormControl componentClass="select">
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