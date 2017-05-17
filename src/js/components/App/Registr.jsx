import React, { Component } from 'react';
import axios from 'axios';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { browserHistory } from 'react-router';


class Auth extends Component {

	constructor() {
		super();
		this.state = {
			login: "",
			password: "",
			confirmPassword: ""
		};
		this.registration = this.registration.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getConfirmPassState = this.getConfirmPassState.bind(this);
		this.getPassState = this.getPassState.bind(this);
		this.getLoginState = this.getLoginState.bind(this);
	}


	registration() {
		if(this.getLoginState() != 'warning' && 
			this.getPassState() != 'warning' && 
			this.getConfirmPassState() != 'warning') {
			
			const dataToRegistr = {
				userName: this.state.login,
				password: this.state.password
			} 
			
			axios.post('url', dataToRegistr)
				.then(function(response) {
					if(response.status === 200) {
						localStorage.setItem('loginToken', response.data.token);
						browserHistory.push('/');
					}
				});
		}
	};

	getLoginState() {
		const length = this.state.login.length;
		if (length === 0) {
			return null;
		} else {
			if (length < 4)  
				return 'warning'
			else 
				return 'success'
		}
	}

	getPassState() {
		const length = this.state.password.length;
		if (length === 0) {
			return null;
		} else {
			if (length < 6) 
				return 'warning'
			else 
				return 'success'
		}
	}

	getConfirmPassState() {
		const pass = this.state.confirmPassword;
		if (pass.length === 0) {
			return null;
		} else {
			if (this.state.password != pass) {
				return 'warning';
			} else {
				return 'success';
			}
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.id]: e.target.value 
		});
	}

	render() {
		return (
			<div>
				<Well> 
					<Form horizontal>
						<FormGroup controlId="formLogin" 
									validationState={this.getLoginState()}>
							<Col sm={2}>
								Login
							</Col>
							<Col sm={10}>
								<FormControl 
									id="login" 
									type="text" 
									value={this.state.login}
									placeholder="Login" 
									onChange={this.handleChange}
								/>
								<FormControl.Feedback />
								<HelpBlock> {this.getLoginState() === 'warning' ? 'Must be longer than 4 characters' : null} </HelpBlock>
							</Col>
						</FormGroup>

						<FormGroup controlId="formPassword" 
									validationState={this.getPassState()}>
							<Col sm={2}>
								Password
							</Col>
							<Col sm={10}>
								<FormControl 
									id="password" 
									type="password" 
									value={this.state.password}
									placeholder="Password"
									onChange={this.handleChange} 
								/>
								<FormControl.Feedback />
								<HelpBlock> {this.getPassState() === 'warning' ? 'Must be longer than 6 characters' : null} </HelpBlock>
							</Col>
						</FormGroup>

						<FormGroup controlId="formConfirmPassword" 
									validationState={this.getConfirmPassState()}>
							<Col sm={2}>
								Confirm password
							</Col>
							<Col sm={10}>
								<FormControl 
									id="confirmPassword" 
									type="password"
									value={this.state.confirmPassword}
									placeholder="Confirm password"
									onChange={this.handleChange} 
								/>
								<FormControl.Feedback />
								<HelpBlock>
									{this.getConfirmPassState() === 'warning' ? 'Passwords don\'t equals' : null}
								</HelpBlock>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Button bsStyle="success" onClick={this.registration}>
									Registration
								</Button>
							</Col>
						</FormGroup>
					</Form>
				</Well>
			</div>
		);
	}

}

export default Auth