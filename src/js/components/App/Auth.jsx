import React, { Component } from 'react';
import axios from 'axios';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { Link, browserHistory } from 'react-router';


class Auth extends Component {

	constructor(props) {
		super(props);
		this.state = {
			login: "",
			password: "",
			status: null
		};
		this.auth = this.auth.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	auth() {
		let self = this;
		axios.get('http://' + this.state.login + ':' + this.state.password + '@0.0.0.0:5000/login/')
			.then(function(response) {
				localStorage.setItem('loginToken', response.data.token);
				self.props.callback();
				browserHistory.push('/');
			})
			.catch(function(response) {
				console.log(response);
				self.setState({
						password: "",
						status: "error"
					});
			})
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
									validationState={this.state.status}>
							<Col  sm={2}>
								Email
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
							</Col>
						</FormGroup>

						<FormGroup controlId="formPassword" 
									validationState={this.state.status}>
							<Col  sm={2}>
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
								<HelpBlock>{this.state.status === "error" ? "Invalid login or password" : null} </HelpBlock>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Link to='/registr'> First time here? </Link>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Button bsStyle="success" onClick={this.auth}>
									Login
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