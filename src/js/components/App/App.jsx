import React, { Component } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem  from 'react-bootstrap/lib/NavItem';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import AddJob from './AddJob';
import ListJobs from './ListJobs';
import ServerAPI from '../ServerAPI';
import axios from 'axios';
import './bootstrap.css';


class App extends Component {
    constructor() {
        super();
    };

    componentWillMount() {
        /*axios.get('/csvfiles')
            .then(function(response) {
                console.log(response);
            })
        axios.get('/matching')
            .then(function(response) {
                console.log(response);
            })*/
        /*axios.get('/fieldnames/?file_path=entity_matching_tool/csv_files/customers.csv')
            .then(function(response) {
                console.log(response);
            })*/
    };
  
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                          <span>Entity Matching Tool</span>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Form pullRight>
                            <FormGroup>
                                <FormControl bsSize="sm" type="email" placeholder="Email" />
                                {' '}
                                <FormControl bsSize="sm" type="password" placeholder="Password" />
                            </FormGroup>
                            {' '}
                            <Button bsStyle='succes' bsSize="small">Sign in</Button>
                        </Navbar.Form>
                    </Navbar.Collapse>
                </Navbar>
                <Grid>
                    <div className="view-jobs">
                        <div className="add-job">
                            <h1>Jobs list</h1>
                            <AddJob/>
                        </div>
                        <div className="list-jobs">
                            <ListJobs/>
                        </div>
                    </div>
                </Grid>
            </div>
        ); 
    }
}

export default App;