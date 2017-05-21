import React, { Component } from 'react';
import axios from 'axios';
import Well from 'react-bootstrap/lib/Well';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';


class Mathcing extends Component {

	constructor() {
		super();
		this.state = {
			matchingEntity: {
				name: null,
				id: null
			},
			currentEntityId: 0,
			metrics: null,
			help: false,
			url: localStorage.getItem('loginToken') ? 'http://' + localStorage.getItem('loginToken') + ':@localhost:5000' : null
		};
		this.match = this.match.bind(this);
		this.refreshEntities = this.refreshEntities.bind(this);
		this.changeMetric = this.changeMetric.bind(this);

	}

	componentWillMount() {
		let self = this;
		axios.get('/metrics/')
        	.then(function(response) {
        		console.log(response);
                self.setState({
                    metrics: response.data
                                .map((metric) => <option key={metric} value={metric}>{metric}</option>)
                });
            });
        /*axios.get(this.state.url + "/entities/?jobId=" + this.props.params.id + "&lastEntityId=0")
        	.then(function(response){
	            self.setState({
	            	matchingEntity: response.data[0] ? response.data[0] : {name: "All entity was matched", id: 0},
	            	listEntities: response.data.slice(1, response.data.length)
	            		.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)
	            });
        	});*/
       	this.refreshEntities();
	}

	match() {
		let self = this;
		const id = document.getElementById('listEntities').value
		if (id !== "" && id !== null) {
			this.setState({
				help: false 
			});
			axios.post(this.state.url + /matching/, {
				entity1_id: this.state.matchingEntity.id,
				entity2_id: document.getElementById('listEntities').value
			}).then(function(response) {
				console.log(response);
				self.refreshEntities(self.state.matchingEntity.id)
			})
		} else {
			this.setState({
				help: true 
			});
		}
	}

	refreshEntities(id) {
		if(!id) {
			id = 0;
		}
		let self = this;
		axios.get(this.state.url + "/entities/?jobId=" + this.props.params.id + "&lastEntityId=" + id)
            .then(function(response){
            	console.log(response);
            	if(response.data.length !== 0 && response.data.length !== 1) {
	                self.setState({
	                	matchingEntity: response.data[0],
	                	listEntities: response.data.slice(1, response.data.length)
	                		.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)
	                });
	            } else {
	            	self.setState({
	            		matchingEntity: {name: "All entity was matched", id: 0}
	            	});
	            }
            });
	}

	changeMetric() {
        let self = this;
        axios.post(this.state.url + '/changemetric/', {
            jobId: this.props.params.id,
            metric: document.getElementById("metrics").value
        }).then(function(response) {
        	self.refreshEntities();
        });  
    }

    toStart() {
    	this.refreshEntities();
    }


	render() {
		return (
			<Well> 
				<FormGroup>
			    	<ControlLabel>Entity from first file</ControlLabel>
			    	<FormControl.Static>
			    		{this.state.matchingEntity.name}
			    	</FormControl.Static>
			    </FormGroup>

				<FormGroup controlId="listEntities">
                    <ControlLabel>Sorted entities from second file</ControlLabel>
                    <FormControl componentClass="select" multiple>
                        {this.state.listEntities}
                    </FormControl>
                </FormGroup>

               	<FormGroup controlId="metrics">
               		<FormControl componentClass="select" onChange={() => this.changeMetric()}>
               			{this.state.metrics} 
               		</FormControl>
               		<HelpBlock>{this.state.help ? "Select entity" : null} </HelpBlock>
               	</FormGroup>
               	<ButtonToolbar>
	                <Button bsStyle='success' onClick={() => this.match()}> Matching </Button>
	                <Button onClick={() => this.refreshEntities(this.state.matchingEntity.id)}> Next entity </Button>
	                <Button onClick={() => this.toStart()}> Refresh </Button>
				</ButtonToolbar>
			</Well>
			)
	}
}

export default Mathcing;