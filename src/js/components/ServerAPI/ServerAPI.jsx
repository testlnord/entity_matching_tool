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

export default function getListJobs() {
	//TODO: AJAX post to server
	return list;
}

