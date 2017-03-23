import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup  from 'react-bootstrap/lib/ButtonGroup';


export default function ListJobs(props) {

	let numbers = Array.apply(null, {length: props.length}).map(Number.call, Number);  
    const listJobs = numbers.map((number) => 
    	<Button key={number.toString()}>Job {number + 1}</Button>);
	
	return (
		<ButtonGroup vertical block>
			{listJobs}
		</ButtonGroup>
	);

};