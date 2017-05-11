import csv
from enum import Enum
import os

from fuzzywuzzy import fuzz
from flask import request
from flask_restful import Resource, reqparse


from .models import User, Job, Entity, MatchedEntities
from entity_matching_tool import app

parser = reqparse.RequestParser()
parser.add_argument('job_id', type=int)
parser.add_argument('file_path', type=str)
parser.add_argument('last_entity_id', type=int)


def get_job_or_abort():
    job_id = parser.parse_args()['job_id']
    job = Job.query.filter(Job.id == job_id).first()
    if not job:
        app.logger.error("Job {} doesn't exist".format(job_id))
    else:
        return job


class Jobs(Resource):
    def get(self):
        """
        Send job by id
        :arg: job_id
        :return: job as JSON with keys:
            id: id of job
            name: name of job
            source1: name of first csv-file
            source2: name of second csv-file
            selected_fields: JSON with keys: 'source1', 'source2'. Values are entities field names
            output_file_name: name of file for results
            creation_date: timestamp
            matric: name of metric
            creator: id of user
        """
        try:
            job = get_job_or_abort()
            return job.to_dict()
        except Exception as e:
            app.logger.exception(e)

    def delete(self):
        """
        Delete existing job from database
        :arg: job_id
        :return: status
        """
        try:
            job = get_job_or_abort()
            Job.query.filter(Job.id == job.id).delete()
            return {'status': 'Deleted'}
        except Exception as e:
            app.logger.exception(e)

    def post(self):
        """
        Add new job and all entities to database
        :arg: JSON with keys: name, source1, source2, selected_fields, output_file_name, metric
        :return: status, job_id
        """
        try:
            name = request.json.get('name')
            source1 = request.json.get('source1')
            source2 = request.json.get('source2')
            selected_fields = request.json.get('selected_fields')
            output_file_name = request.json.get('output_file_name')
            metric = request.json.get('metric')
            user = User.query.filter(User.user_name == 'admin').first().id

            job = Job(name, source1, source2, selected_fields, output_file_name, metric, user)
            job.save()

            job = Job.query.filter(Job.name == job.name,
                                   Job.source1 == job.source1, Job.source2 == job.source2).first()
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
            return {'status': 'Created', 'job_id': job.id}
        except Exception as e:
            app.logger.exception(e)


class JobList(Resource):
    def get(self):
        """
        Send existing jobs
        :return: list of jobs
        """
        try:
            jobs = Job.query.all()
            job_list = []
            for job in jobs:
                job_dict = job.to_dict()
                job_list.append(job_dict)
            return job_list
        except Exception as e:
            app.logger.exception(e)


class CsvFiles(Resource):
    def __init__(self):
        self.directory_path = 'entity_matching_tool/csv_files'

    def get(self):
        """
        Send sourceslist to client
        :return: list of csv-file paths
        """
        try:
            file_names = os.listdir(self.directory_path)
            file_paths = [os.path.join(self.directory_path, file_name) for file_name in file_names]
            return file_paths
        except Exception as e:
            app.logger.exception(e)


class FieldNames(Resource):
    def get(self):
        """
        Send entities field names from selected file
        :arg: file_path
        :return: list of field names
        """
        try:
            file_path = parser.parse_args()['file_path']
            with open(file_path, 'r') as csv_file:
                reader = csv.reader(csv_file)
                for row in reader:
                    return row
        except Exception as e:
            app.logger.exception(e)


class MetricNames(Resource):
    def get(self):
        """
        Send metric names
        :return: list of metric names
        """
        try:
            names = list(map(lambda x: x.value, Metric))
            return names
        except Exception as e:
            app.logger.exception(e)


class Metric(Enum):
    SIMPLE = 'Simple'
    PARTIAL = 'Partial'
    TOKEN_SORT = 'Token Sort'
    TOKEN_SET = 'Token Set'


def sort_by_metric(first_entity, list_of_entities, name_metric):
    try:
        if name_metric == Metric.SIMPLE.value:
            sort_function = fuzz.ratio
        elif name_metric == Metric.PARTIAL.value:
            sort_function = fuzz.partial_ratio
        elif name_metric == Metric.TOKEN_SORT.value:
            sort_function = fuzz.token_sort_ratio
        elif name_metric == Metric.TOKEN_SET.value:
            sort_function = fuzz.token_set_ratio
        else:
            app.logger.error("Metric name '{}' is not defined".format(name_metric))
        res = []
        for second_entity in list_of_entities:
            res.append((sort_function(first_entity.name, second_entity.name), second_entity))
        sorted_entities = list(map(lambda x: x[1], sorted(res, reverse=True)))
        return sorted_entities
    except Exception as e:
        app.logger.exception(e)


class Entities(Resource):
    def get(self):
        """
        Send entities for job
        :arg: job_id, last_entity_id
        :return: list of entities, where entity is JSON with keys:
            id: id of entity
            name: name of entity
            job_id: id of job
            is_first_source: Boolean value
            other_fields: JSON with another information about entity
        """
        try:
            job = get_job_or_abort()
            last_entity_id = parser.parse_args()['last_entity_id']
            entity_from_first_source = Entity.query.filter(Entity.job_id == job.id,
                                                           Entity.is_first_source,
                                                           Entity.is_matched == False,
                                                           Entity.id > last_entity_id).first()
            if entity_from_first_source is None:
                return []
            entity_list = [entity_from_first_source.to_dict()]
            entities_from_second_source = Entity.query.filter(Entity.job_id == job.id,
                                                              Entity.is_first_source == False,
                                                              Entity.is_matched == False).all()
            if entities_from_second_source is None:
                return []
            entities_from_second_source = sort_by_metric(entity_from_first_source, entities_from_second_source, job.metric)
            for entity in entities_from_second_source:
                entity_list.append(entity.to_dict())
            return entity_list
        except Exception as e:
            app.logger.exception(e)


class Matching(Resource):
    def post(self):
        """
        Add matched pair to database
        :arg: JSON with keys: entity1_id, entity2_id
        :return: status
        """
        try:
            entity1_id = request.json.get('entity1_id')
            entity2_id = request.json.get('entity2_id')
            entity1 = Entity.query.filter(Entity.id == entity1_id).first()
            entity1.set_as_matched()
            entity2 = Entity.query.filter(Entity.id == entity2_id).first()
            entity2.set_as_matched()
            if not entity1 or not entity2:
                app.logger.error("Entity {} or {} doesn't exist".format(entity1_id, entity2_id))
            user = User.query.filter(User.user_name == 'admin').first().id
            match = MatchedEntities(entity1_id, entity2_id, user)
            match.save()
            return {'status': 'Matched'}
        except Exception as e:
            app.logger.exception(e)

    def get(self):
        """
        Send all matched entities
        :return: list of pairs
        """
        try:
            matched_entities = MatchedEntities.query.all()
            print(matched_entities)
            res = []
            for match in matched_entities:
                entity1 = Entity.query.filter(Entity.id == match.entity1_id).first().name
                entity2 = Entity.query.filter(Entity.id == match.entity2_id).first().name
                res.append((entity1, entity2))
            return res
        except Exception as e:
            app.logger.exception(e)
