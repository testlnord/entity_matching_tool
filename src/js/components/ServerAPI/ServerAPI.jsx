//Templates jobs
//---------------------------------------------------
const job1 = {
	request: "Tesla",
	response: "Tesla tech."
}

const job2 = {
	request: "Lala",
	response: "Lalala"
}

const list = {
	jobs: [job1, job2],
	length: 2
}
//-----------------------------------------------------

let	getListJobs = function() {
	//TODO: AJAX post to server
	return list;
};

let sendJob = function() {
	//TODO: AJAX post
}


export default {getListJobs, sendJob};

