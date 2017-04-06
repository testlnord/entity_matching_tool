import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup  from 'react-bootstrap/lib/PanelGroup';
import ServerAPI from '../ServerAPI';
  	
    
class ListJobs extends Component {

	constructor(props) {
		super();
		this.state = {
			activeKey: '1',
			listJobs: //Array.apply(null, {length: props.length}).map(Number.call, Number)
					  ServerAPI.getNameJobs()
				.map((name) => 
					<Panel key={name.toString()} header={(name)} eventKey={name}>Content of job</Panel>)
		};
		this.handleSelect = this.handleSelect.bind(this);
	}

	handleSelect(activeKey) {
		this.state.activeKey === activeKey ? this.setState({ activeKey: null}) : this.setState({ activeKey: activeKey });
	};

	render() {
		console.log(this.state.listJobs);
		return (
			<PanelGroup activeKey={this.state.activeKey} 
				onSelect={this.handleSelect} accordion>
				{this.state.listJobs}
			</PanelGroup>
		);
	};
};

export default ListJobs;