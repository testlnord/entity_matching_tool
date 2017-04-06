import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import ServerAPI from '../ServerAPI';


function FieldGroup({ id,label,help, ...props }) {
	return (
		<FormGroup controlId={id}>
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

//Temporary solution (need config file)
let loadFile = function(self, file, number) {
	let reader = new FileReader();

	reader.onload = function(event) {
		if(number === 1) {
			self.setState({ 
				source1 : csvJSON(event.target.result)
			});
		}
		if(number === 2) {
			self.setState({
				source2 : csvJSON(event.target.result) 
			});
		}
	}
	reader.readAsText(file);
};



class AddJob extends Component {

	constructor() {
		super();
		this.state = {
			open: false,
			isLoading: false,
			metrics: ServerAPI.getMetrics()
				.map((metric) => <option key={metric} value={metric}>{metric}</option>),
			jobToServer: {}
		};
		this.handleClick = this.handleClick.bind(this);
	};

	

	handleClick() {
		this.setState({
			isLoading: true,
		});
		let self = this

		loadFile(self, document.getElementById("firstSource").files[0], 1);
		loadFile(self, document.getElementById("secondSource").files[0], 2);
		let timerSend = setInterval(function() {
			if(self.state.source1 && self.state.source2) {
				clearInterval(timerSend);
				self.setState({
					jobToServer: {
						name: document.getElementById("jobName").value,
						source1: self.state.source1,
						source2: self.state.source2,
						selectedFields: document.getElementById("selectedFields").value,
						metric: document.getElementById("selectMetric").value
					}
				});
				console.log(self.state.jobToServer);
				ServerAPI.sendJob(self.state.jobToServer, self);				
			}
		},500);


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
							type="text"
							label="Jobs name"
							placeholder="Enter name"		
						/>
						<FieldGroup
							id="firstSource"
							type="file"
							label="First source file"
						/>
						<FieldGroup
							id="secondSource"
							type="file"
							label="Second source file"
						/>
						<FormGroup controlId="selectedFields">
							<ControlLabel>Selected fields (name1, name2, ...)</ControlLabel>
							<FormControl componentClass="textarea" placeholder="Enter names"/>
						</FormGroup>
						<FormGroup controlId="selectMetric">
							<ControlLabel>Choose metric</ControlLabel>
							<FormControl componentClass="select" placeholder="select">
								{this.state.metrics}
							</FormControl>
						</FormGroup>
						<Button
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