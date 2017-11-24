import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as authActions from '../actions/authActions'

import Grid  from 'react-bootstrap/lib/Grid'
import Nav from 'react-bootstrap/lib/Nav'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem  from 'react-bootstrap/lib/NavItem'
import '../styles/bootstrap.css'


class App extends Component {

    constructor(props) {
        super();
        this.logOut = this.logOut.bind(this);
    }

    logOut(event) {
        if (this.props.loggedIn) {
            event.preventDefault();
            this.props.actions.logOutUser();
        }
    }

    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href='/'>Entity Matching Tool</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem onClick={this.logOut}>
                                {this.props.loggedIn ? "Log out" : "Log in"}
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Grid>
                    {this.props.children}
                </Grid>
            </div>
        ); 
    }
}

App.propTypes = {
    actions: PropTypes.object.isRequired
};

function mapStateToProps (state) {
    return {
        loggedIn: state.auth.loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);