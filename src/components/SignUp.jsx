import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../actions/authActions'

import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Button from 'react-bootstrap/lib/Button'
import Form from 'react-bootstrap/lib/Form'
import Col from 'react-bootstrap/lib/Col'
import Well from 'react-bootstrap/lib/Well'
import HelpBlock from 'react-bootstrap/lib/HelpBlock'


class SignUp extends Component {

    constructor() {
        super();
        this.state = {
            credentials: {
                login: '',
                password: '',
                confirmPassword: ''
            }
        };

        this.onSave = this.onSave.bind(this);
        this.onChange = this.onChange.bind(this);
        this.checkCredentials = this.checkCredentials.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkConfirmPassword = this.checkConfirmPassword.bind(this);
    }

    onChange(event) {
        const field = event.target.id;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;
        return this.setState({ credentials: credentials });
    }

    onSave(event) {
        event.preventDefault();
        const dataToRegister = {
            userName: this.state.credentials.login,
            password: this.state.credentials.password
        };
        if (this.checkCredentials()) this.props.actions.registerUser(dataToRegister);
    }

    checkCredentials() {
        return this.checkLogin() === 'success'
            && this.checkPassword() === 'success'
            && this.checkConfirmPassword() === 'success';
    }

    checkLogin() {
        const length = this.state.credentials.login.length;
        if (length === 0) return null;
        if (length < 4) return 'warning';
        return 'success';
    }

    checkPassword() {
        const length = this.state.credentials.password.length;
        if (length === 0) return null;
        if (length < 6) return 'warning';
        return 'success';
    }

    checkConfirmPassword() {
        const password = this.state.credentials.confirmPassword;
        if (password.length === 0) return null;
        if (this.state.credentials.password !== password) return 'warning';
        return 'success';
    }

    render() {
        return (
            <div>
                <Well>
                    <Form horizontal>
                        <FormGroup controlId="formLogin" validationState={this.checkLogin()}>
                            <Col sm={2}>
                                Login
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    id="login"
                                    type="text"
                                    value={this.state.credentials.login}
                                    placeholder="Login"
                                    onChange={this.onChange}
                                />
                                <FormControl.Feedback />
                                <HelpBlock>
                                    {this.checkLogin() === 'warning' ? 'Must be longer than 4 characters' : null}
                                </HelpBlock>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formPassword" validationState={this.checkPassword()}>
                            <Col sm={2}>
                                Password
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    id="password"
                                    type="password"
                                    value={this.state.credentials.password}
                                    placeholder="Password"
                                    onChange={this.onChange}
                                />
                                <FormControl.Feedback />
                                <HelpBlock>
                                    {this.checkPassword() === 'warning' ? 'Must be longer than 6 characters' : null}
                                </HelpBlock>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formConfirmPassword" validationState={this.checkConfirmPassword()}>
                            <Col sm={2}>
                                Confirm password
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    id="confirmPassword"
                                    type="password"
                                    value={this.state.credentials.confirmPassword}
                                    placeholder="Confirm password"
                                    onChange={this.onChange}
                                />
                                <FormControl.Feedback />
                                <HelpBlock>
                                    {this.checkConfirmPassword() === 'warning' ? 'Passwords aren\'t equal' : null}
                                </HelpBlock>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button bsStyle="success" disabled={!this.checkCredentials()} onClick={this.onSave}>
                                    Registration
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Well>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SignUp)