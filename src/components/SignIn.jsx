import React, { Component } from 'react'
import { Link } from 'react-router'
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


class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            credentials: {
                login: '',
                password: ''
            }
        };
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onChange(event) {
        const field = event.target.id;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;
        return this.setState({ credentials: credentials });
    }

    onSave(event) {
        event.preventDefault();
        this.props.actions.logInUser(this.state.credentials);
    }

    render() {
        return (
            <div>
                <Well>
                    <Form horizontal>
                        <FormGroup controlId="formLogin" validationState={this.props.status}>
                            <Col  sm={2}>
                                Email
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
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formPassword" validationState={this.props.status}>
                            <Col  sm={2}>
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
                                <HelpBlock>{this.props.status ? this.props.errorMassage : null} </HelpBlock>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Link to='/signup'> First time here? </Link>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button bsStyle="success" onClick={this.onSave}>
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

function mapStateToProps(state) {
    return {
        status: state.auth.status,
        errorMassage: state.auth.errorMassage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)