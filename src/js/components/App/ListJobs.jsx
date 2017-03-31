import React, { Component } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PanelGroup  from 'react-bootstrap/lib/PanelGroup';
  	
    
class ListJobs extends Component {

	constructor(props) {
		super();
		this.state = {
			activeKey: '1',
			listJobs: Array.apply(null, {length: props.length}).map(Number.call, Number)
				.map((number) => 
					<Panel key={number.toString()} header={"Job " + (number + 1)} eventKey={number}>Content of job</Panel>)
		};
		this.handleSelect = this.handleSelect.bind(this);
	}

	handleSelect(activeKey) {
		this.state.activeKey === activeKey ? this.setState({ activeKey: null}) : this.setState({ activeKey: activeKey });
	};

	render() {
		return (
			<PanelGroup activeKey={this.state.activeKey} 
				onSelect={this.handleSelect} accordion>
				{this.state.listJobs}
			</PanelGroup>
		);
	};
};

export default ListJobs;