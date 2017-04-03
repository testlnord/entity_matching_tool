from flask import request
from flask_restful import Resource, abort

from entity_matching_tool.models import User, Job


class Jobs(Resource):
    def get(self, job_id):
        print(job_id)
        job = Job.query.filter(Job.id == job_id).first()
        if not job:
            abort(404, message="Job {} doesn't exist".format(job_id))
        return job

    def delete(self, job_id):
        job = Job.query.filter(Job.id == job_id).first()
        if not job:
            abort(404, message="Job {} doesn't exist".format(job_id))
        Job.query.filter(Job.id == job_id).delete()
        return 'Deleted'

    def post(self):
        name = request.json.get('name')
        source1 = request.json.get('source1')
        source2 = request.json.get('source2')
        selected_fields = request.json.get('selected_fields')
        output_file_name = request.json.get('output_file_name')
        user = User.query.filter(User.name == 'admin').first().id

        job = Job(name, source1, source2, selected_fields, output_file_name, user)
        job.save()
        return job


class JobList(Resource):
    def get(self):
        jobs = Job.query.all()
        return jobs

