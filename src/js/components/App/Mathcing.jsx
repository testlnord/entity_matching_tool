import React, { Component } from 'react';
import axios from 'axios';
import Well from 'react-bootstrap/lib/Well';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';


class Mathcing extends Component {

	constructor() {
		super();
		this.state = {
			mathcingEntity: {
				name: null,
				id: null
			},
			mathcingEntityEntities: null,
			url: localStorage.getItem('loginToken') ? 'http://' + localStorage.getItem('loginToken') + ':@localhost:5000' : null
		};
		this.match = this.match.bind(this);

	}

	componentWillMount() {
		let self = this;
		axios.get(this.state.url + "/entities/?jobId=" + this.props.params.id + "&lastEntityId=0")
            .then(function(response){
            	console.log(response);
                self.setState({
                	mathcingEntity: response.data[0],
                	listEntities: response.data.slice(1, response.data.length - 1)
                		.map((entity) => <option key={entity.id} value={entity.id}>{entity.name}</option>)
                });
            })
	}

	match() {
		axios.post(this.state.url + /matching/, {
			entity1_id: this.state.matchingEntity.id,
			entity2_id: document.getElementById('listEntities').value
		}).then(function(response) {
			console.log(response);
		})
	}


	render() {
		return (
			<Well> 

				<FormGroup>
			    	<ControlLabel>Entity from first file</ControlLabel>
			    	<FormControl.Static>
			    		{this.state.mathcingEntity.name}
			    	</FormControl.Static>
			    </FormGroup>

				<FormGroup controlId="listEntities">
                    <ControlLabel>Sorted entities from second file</ControlLabel>
                    <FormControl componentClass="select" multiple>
                        {this.state.listEntities}
                    </FormControl>
                </FormGroup>

                <Button bsStyle='success' onClick={() => this.match()}> Matching </Button>
			</Well>
			)
	}
}

export default Mathcing;