import React, { Component } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem  from 'react-bootstrap/lib/NavItem';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import { Link, browserHistory } from 'react-router';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import './bootstrap.css';


class App extends Component {
    constructor() {
        super();
        this.state = {
            isLogin: localStorage.getItem('loginToken') ? true : false
        }
        this.callbackLogin = this.callbackLogin.bind(this);
    };

    componentWillMount() {
        if(this.state.isLogin) {
            this.setState({
                token: localStorage.getItem('loginToken') 
            });
        } else {
            browserHistory.push('/signin');
        }
    }

    loginLogout() {
        if (this.state.isLogin) {
            localStorage.removeItem('loginToken')
            this.setState({
                isLogin: !this.state.isLogin 
            });
        }

        browserHistory.push('/signin');
    }

    callbackLogin() {
        this.setState({
            isLogin: localStorage.getItem('loginToken') ? true : false
        });
    }

    render() {
        const children = React.Children.map(this.props.children, (child) => 
                                            React.cloneElement(child, {
                                                callback: this.callbackLogin
                                            })
                                        );
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
                            <NavItem onClick={() => this.loginLogout()}>
                                {this.state.isLogin ? "Logout" : "Login"}
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Grid>
                    {children}
                </Grid>
            </div>
        ); 
    }
}

export default App;