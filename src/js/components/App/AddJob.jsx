import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import ServerAPI from '../ServerAPI';


function FieldGroup({ id,label,help, ...props}) {
	return (
		<FormGroup controlId={id}>
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
			open: false,
			isLoading: false

		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({
			isLoading: true 
		});
		//Temporary solution
		let self = this;
		//
		ServerAPI.sendJob(self);
	};

	render() {
		return (
			<div>
			<Button onClick={ () => this.setState({ open: !this.state.open })}>
					Add job
			</Button>
			<Panel collapsible expanded={this.state.open}>
				<form>
					<FieldGroup
						id="jobsName"
						type="text"
						label="Jobs name"
						placeholder="Enter name"		
					/>
					<FieldGroup
						id="fileName"
						type="text"
						label="File name"
						placeholder="Enter file name"
					/>
					<FieldGroup
						id="jobsFile"
						type="file"
						label="File"
					/>
					<Button
						bbStyle="primary"
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