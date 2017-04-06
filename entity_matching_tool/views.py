import csv
import os

from flask import request
from flask_restful import Resource, abort

from entity_matching_tool.models import User, Job, Entity


def get_job_or_abort():
    job_id = request.json.get('job_id')
    job = Job.query.filter(Job.id == job_id).first()
    if not job:
        abort(404, message="Job {} doesn't exist".format(job_id))
    else:
        return job


class Jobs(Resource):
    def get(self):
        """
        Send job by id
        :arg: JSON with keys: job_id
        :return: job as JSON with keys:
            id: id of job
            name: name of job
            source1: name of first csv-file
            source2: name of second csv-file
            selected_fields: JSON with keys: 'source1', 'sourrce2'. Values are entities field names
            output_file_name: name of file for results
            creation_date: timestamp
            creator: id of user
        """
        job = get_job_or_abort()
        return job.__dict__

    def delete(self, f):
        """
        Delete existing job from database
        :arg: JSON with keys: job_id
        :return: status
        """
        job = get_job_or_abort()
        Job.query.filter(Job.id == job.id).delete()
        return {'status': 'Deleted'}

    def post(self):
        """
        Add new job to database
        :arg: JSON with keys: name, source1, source2, selected_fields, output_file_name
        :return: status
        """
        name = request.json.get('name')
        source1 = request.json.get('source1')
        source2 = request.json.get('source2')
        selected_fields = request.json.get('selected_fields')
        output_file_name = request.json.get('output_file_name')
        user = User.query.filter(User.name == 'admin').first().id

        job = Job(name, source1, source2, selected_fields, output_file_name, user)
        job.save()
        return {'status': 'Created'}


class JobList(Resource):
    def get(self):
        """
        Send existing jobs
        :return: list of jobs
        """
        jobs = Job.query.all()
        job_list = []
        for job in jobs:
            job_list.append(job.__dict__)
        return job_list


class CsvFiles(Resource):
    def __init__(self):
        self.directory_path = 'csv_files'

    def get(self):
        """
        Send sourceslist to client
        :return: list of csv-file paths
        """
        file_names = os.listdir(self.directory_path)
        file_paths = [os.path.join(self.directory_path, file_name) for file_name in file_names]
        return file_paths


class FieldNames(Resource):
    def get(self):
        """
        Send entities field names from selected file
        :arg: JSON with keys: file_path
        :return: list of field names
        """
        file_path = request.json.get('file_path')
        with open(file_path, 'r') as csv_file:
            reader = csv.reader(csv_file)
            for row in reader:
                return row


class Entities(Resource):
    def get(self):
        """
        Send entities for job
        :arg: JSON with keys: job_id
        :return: list of entities, where entity is JSON with keys:
            id: id of entity
            name: name of entity
            job_id: id of job
            is_first_sourse: Boolean value
            other_fields: JSON with another information about entity
        """
        job = get_job_or_abort()
        entities = Entity.query.filter(Entity.job_id == job.id).all()
        entity_list = []
        for entity in entities:
            entity_list.append(entity.__dict__)
        return entity_list

    def post(self):
        """
        Add all entities to database from two source files
        :arg: JSON with keys: job_id
        :return: status
        """
        job = get_job_or_abort()
        with open(job.source1) as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                name = row.pop(job.selected_fields['source1'])
                entity = Entity(job.id, True, name, row)
                entity.save()
        with open(job.source2) as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                name = row.pop(job.selected_fields['source2'])
                entity = Entity(job.id, False, name, row)
                entity.save()
        return {'status': 'All entities added'}
