import React, { Component, PropTypes } from 'react';
import Grid  from 'react-bootstrap/lib/Grid';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem  from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup  from 'react-bootstrap/lib/ButtonGroup';
import getListJobs from '../ServerAPI';
import './bootstrap.css';

const propTypes = {
  children: PropTypes.node,
};

const jobs = getListJobs();

console.log(jobs.length);

const numbers = Array.apply(null, {length: jobs.length}).map(Number.call, Number);

const listButton = numbers.map((number) => 
    <Button key={number.toString()}>Job {number + 1} </Button>);

class App extends Component {
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
           </Navbar.Collapse>
        </Navbar>
        <Grid>
          {this.props.children}
        </Grid>
      <div>
        <ButtonGroup vertical>
          {listButton}
        </ButtonGroup>
      </div>
      </div>
      
    );
  }
}

App.propTypes = propTypes;

export default App;