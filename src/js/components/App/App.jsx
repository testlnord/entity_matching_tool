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
    };

    componentWillMount() {
        if(localStorage.getItem('loginToken')) {
            this.setState({
                token: localStorage.getItem('loginToken') 
            });
        } else {
            browserHistory.push('/login');
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
                            <NavItem>
                                <Link to='/login'> Login </Link>
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

export default App;