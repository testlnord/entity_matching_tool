import React, { Component } from 'react'
import axios from 'axios'

import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Modal from 'react-bootstrap/lib/Modal'
import Panel from 'react-bootstrap/lib/Panel'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import HelpBlock from 'react-bootstrap/lib/HelpBlock'
import { AlertList } from "react-bs-notifier"

function FieldGroup({ id,status,label,help, ...props }) {
    return (
        <FormGroup controlId={id} validationState={status}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props}/>
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class AddJob extends Component {

    constructor() {
        super();
        this.state = {
            alerts: [],
            open: false,
            status: {
                name: null,
                source1: null,
                source2: null,
                firstFields: null,
                secondFields: null,
                metric: null,
                outputFileName: null
            },
            isLoading: false,
            metrics: null,
            paths: null,
            firstFields: null,
            secondFields: null,
            addSrc: {
                open: false,
                status: ""
            }
        };
        this.handleClick = this.handleClick.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.refreshFirstFields = this.refreshFirstFields.bind(this);
        this.refreshSecondFields = this.refreshSecondFields.bind(this);
        this.uploadCsvFile = this.uploadCsvFile.bind(this);
        this.generateAlert = this.generateAlert.bind(this);
    }

    generateAlert(type, massage) {
        const newAlert = {
            id: (new Date()).getTime(),
            type: type,
            message: massage
        };

        this.setState({
            alerts: [...this.state.alerts, newAlert]
        });
    }

    onAlertDismissed(alert) {
        const alerts = this.state.alerts;
        // find the index of the alert that was dismissed
        const idx = alerts.indexOf(alert);
        if (idx >= 0) {
            this.setState({
                // remove the alert from the array
                alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
            });
        }
    }

    componentWillMount() {
        this.getMetrics();
        this.getCsvFiles();
    }

    getMetrics() {
        let self = this;
        axios.get('/metrics/')
            .then(function(response) {
                self.setState({
                    metrics: response.data
                        .map((metric) => <option key={metric} value={metric}>{metric}</option>)
                });
            });
    }

    getCsvFiles() {
        let self = this;
        axios.get('/csvfiles/')
            .then(function(response) {
                self.setState({
                    paths: response.data
                        .map((path) => <option key={path} value={path}>{path}</option>)
                });
            });
    }

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

    uploadCsvFile(e) {
        for (let i = 0; i < e.target.files.length; i++) {
            let data = new FormData();
            data.append('file', e.target.files[i]);
            axios.post('/files/', data)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        this.getCsvFiles();
        this.setState({ addSrc: { open: true, status: "Uploaded successfully" } });
        this.generateAlert("success", "Uploaded your file(s) to the server")
    }

    handleClick(e) {
        this.setState({ isLoading: true });
        const data = {
            name: document.getElementById("jobName").value,
            source1: document.getElementById("firstSource").value,
            source2: document.getElementById("secondSource").value,
            selectedFields: {
                source1: document.getElementById("firstSelectedFields").value,
                source2: document.getElementById("secondSelectedFields").value
            },
            metric: document.getElementById("selectMetric").value,
            outputFileName: document.getElementById("outputFileName").value
        };
        let self = this;
        let readyToPost = true;
        let status = {};
        for (let key in data)
            if (data.hasOwnProperty(key)) {
                let value = data[key];
                if (!value || value === "") {
                    status[key] = "error";
                    readyToPost = false;
                }
                else status[key] = null;
            }
        this.setState({ status: status });

        if (readyToPost) axios.post('http://' + sessionStorage.getItem('loginToken') + ':' + '@0.0.0.0:5000/jobs/', data)
            .then(function (response) {
                self.props.callback();
                self.generateAlert("success", "Done! Created job successfully");
                setTimeout(() => {
                    self.setState({
                        open: !self.state.open,
                        isLoading: false
                    });
                }, 300);
                document.getElementById("jobName").value = null;
                document.getElementById("firstSource").value = null;
                document.getElementById("secondSource").value = null;
                document.getElementById("firstSelectedFields").value = null;
                document.getElementById("secondSelectedFields").value = null;
                document.getElementById("selectMetric").value = null;
                document.getElementById("outputFileName").value = null;
            })
            .catch(function (error) {
                console.log(error);
                self.generateAlert("error", "Something went wrong... Failed to create the job");
            });
        else {
            self.setState({ isLoading: false });
            e.preventDefault();
        }
    }

    render() {
        return (
            <div>
                <AlertList
                    position="bottom-right"
                    alerts={this.state.alerts}
                    timeout={2500}
                    onDismiss={this.onAlertDismissed.bind(this)}
                />

                <ButtonGroup>
                    <Button onClick={() => this.setState({ open: !this.state.open })}>
                        Add job
                    </Button>
                    <Button onClick={() => this.setState({ addSrc: { open: !this.state.addSrc.open } })} bsStyle="primary">
                        Add source
                    </Button>
                </ButtonGroup>

                <Modal
                    show={this.state.addSrc.open}
                    onHide={() => this.setState({ addSrc: { open: !this.state.addSrc.open, status: "" } })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Import new sources</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FieldGroup
                            id="formControlsFile"
                            type="file"
                            help="There is, as yet, a possibility to attach only .csv-files"
                            componentClass="input"
                            onChange={this.uploadCsvFile}
                            accept=".csv"
                            multiple
                        />
                        <p>{this.state.addSrc.status}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.setState({ addSrc: { open: !this.state.addSrc.open, status: "" } })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

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
                            <ControlLabel>Choose a path to the first source</ControlLabel>
                            <FormControl  componentClass="select" onChange={this.refreshFirstFields}>
                                {this.state.paths}
                            </FormControl>
                        </FormGroup>
                        <div className="firstSelectedFields">
                            <FormGroup controlId="firstSelectedFields" validationState={this.state.status.firstFields}>
                                <ControlLabel>Selected fields for first file</ControlLabel>
                                <FormControl componentClass="select" multiple>
                                    {this.state.firstFields}
                                </FormControl>
                            </FormGroup>
                        </div>
                        <FormGroup controlId="secondSource" validationState={this.state.status.source2}>
                            <ControlLabel>Choose a path to the second source</ControlLabel>
                            <FormControl  componentClass="select" onChange={this.refreshSecondFields}>
                                {this.state.paths}
                            </FormControl>
                        </FormGroup>
                        <FormGroup controlId="secondSelectedFields" validationState={this.state.status.secondFields}>
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
                            onClick={this.handleClick}>
                            {this.state.isLoading ? 'Loading...' : 'Send job to server'}
                        </Button>
                    </form>
                </Panel>

            </div>
        );
    }
}

export default AddJob