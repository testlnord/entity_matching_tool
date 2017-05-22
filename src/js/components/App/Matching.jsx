import React, { Component } from 'react';
import axios from 'axios';
import Well from 'react-bootstrap/lib/Well';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Table from 'react-bootstrap/lib/Table';


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
			firstInfoTable: {
				names: null,
				values: null
			},
			secondInfoTable: null,
			listMatchingEntity: null,
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
                self.setState({
                    metrics: response.data
                                .map((metric) => <option key={metric} value={metric}>{metric}</option>)
                });
            });

       	this.refreshEntities();
        this.refreshTableEntities();
	}

	refreshEntities(id) {
		if(!id) {
			id = 0;
		}
		let self = this;
		axios.get(this.state.url + "/entities/?jobId=" + this.props.params.id + "&lastEntityId=" + id)
            .then(function(response){
            	if(response.data.length !== 0) {
            		self.setState({
	                	matchingEntity: response.data[0],
	                	listEntities: response.data.length !== 1 ? 
				                		response.data.slice(1, response.data.length)
				                			.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>) 
				                		: null,
	                	firstInfoTable: { 	
            						names: response.data[0] ? 
            								Object.keys(response.data[0].otherFields)
                									.map((name) => 
                											<th> {name} </th>
         												) 
                							: null,
            						values: response.data[0] ? 
            								Object.keys(response.data[0].otherFields).map((key) => response.data[0].otherFields[key])
            										.map((value) => 
            												<td> {value} </td>
            											)
            								: null
	                					},
	                	help: response.data.length === 1 
	                });
	            } else {
	            	self.setState({
	            		matchingEntity: {name: "All entity was matched", id: self.state.matchingEntity.id},
	            		firstInfoTable: {
	            					names: null,
	            					values: null
	            		}
	            	});
	            }
            });
	}

	refreshTableEntities() {
		let self = this;
		axios.get(this.state.url + "/matching/?jobId=" + this.props.params.id)
        	.then(function(response) {
        		self.setState({
        			listMatchingEntity: response.data
        									.map((entity) => 
        										<tr>
	        										<td> {entity.entity1} </td>
	        										<td> {entity.entity2} </td>	
	        										<td>  <Button bsSize='xsmall' bsStyle='danger' onClick={() => self.deleteMatchingPair(entity.matchId)}> {"Delete"} </Button></td>
        										</tr>	
        									) 
        		});
        	});
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
				self.refreshEntities(self.state.matchingEntity.id)
				self.refreshTableEntities();
			})
		} else {
			this.setState({
				help: true 
			});
		}
	}

	changeMetric() {
		let self = this;
        axios.post(this.state.url + '/changemetric/', {
            jobId: this.props.params.id,
            metric: document.getElementById("metrics").value
        }).then(function(response) {
        	self.refreshEntities(self.state.matchingEntity.id);
        	self.refreshTableEntities();
        });  
    }

    toStart() {
    	this.refreshEntities();
    	this.refreshTableEntities();
    }

    deleteMatchingPair(id) {
    	let self = this;
    	axios.delete(this.state.url + '/matching/?matchId=' + id)
    		.then(function(response) {
    			self.refreshEntities(self.state.currentEntityId);
    			self.refreshTableEntities();  			
    		})
    }

    save() {
    	axios.get(this.state.url + '/saving/?jobId=' + this.props.params.id)
    		.then(function(response) {
    		})
    }


	render() {
		return (
			<div>
				<Well> 
					<FormGroup>
				    	<ControlLabel>Entity from first file</ControlLabel>
				    	<FormControl.Static>
				    		{this.state.matchingEntity.name}
				    	</FormControl.Static>
				    </FormGroup>

				    <FormGroup>
					    <ControlLabel> Info about entity </ControlLabel>
					    <Table striped bordered condensed hover>
					    	<thead>
							    <tr>
							    	{this.state.firstInfoTable.names}
							    </tr>
						    </thead>
						    <tbody>
							    <tr>
							    	{this.state.firstInfoTable.values}
							    </tr>
						    </tbody>
					    </Table>
				    </FormGroup>

					<FormGroup controlId="listEntities">
	                    <ControlLabel>Sorted entities from second file</ControlLabel>
	                    <FormControl componentClass="select" multiple>
	                        {this.state.listEntities}
	                    </FormControl>
	                    <HelpBlock>{!this.state.help ? "Select entity" : "Entities are over"} </HelpBlock>
	                </FormGroup>

	               	<FormGroup controlId="metrics">
	               		<FormControl componentClass="select" onChange={() => this.changeMetric()}>
	               			{this.state.metrics} 
	               		</FormControl>
	          			<HelpBlock> Change metrics if its need </HelpBlock>
	               	</FormGroup>

	               	<ButtonToolbar>
		                <Button bsStyle='success' onClick={() => this.match()}> Matching </Button>
		                <Button onClick={() => this.refreshEntities(this.state.matchingEntity.id)}> Skip entity </Button>
		                <Button onClick={() => this.toStart()}> Refresh all skiped entity </Button>
		                <Button bsStyle='success' onClick={() => this.save()}> Save matching pair </Button>
					</ButtonToolbar>
				</Well>
				<Well>
					<Table striped bordered condensed hover>
	               	<thead>
	               		<tr>
	               			<th> {"Name of first entity"} </th>
	               			<th> {"Name of second entity"} </th>
	               			<th> {"Delete matching pair"} </th>
	               		</tr>
	               	</thead>
	               	<tbody>
	               		{this.state.listMatchingEntity}
	               	</tbody>
	               	</Table>
				</Well>
			</div>
			)
	}
}

export default Mathcing;