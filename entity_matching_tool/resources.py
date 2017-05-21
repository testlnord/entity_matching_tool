import csv
from enum import Enum
import os

from fuzzywuzzy import fuzz
from flask import request, g
from flask_restful import Resource, reqparse, abort
from flask_httpauth import HTTPBasicAuth

from .models import User, Job, Entity, MatchedEntities
from entity_matching_tool import app

JOB_ID = 'jobId'
FILE_PATH = 'filePath'
LAST_ENTITY_ID = 'lastEntityId'
MATCH_ID = 'matchId'
ENTITY_ID = 'entityId'

auth = HTTPBasicAuth()

parser = reqparse.RequestParser()
parser.add_argument(JOB_ID, type=int)
parser.add_argument(FILE_PATH, type=str)
parser.add_argument(LAST_ENTITY_ID, type=int)
parser.add_argument(MATCH_ID, type=int)
parser.add_argument(ENTITY_ID, type=int)


def get_job_or_abort():
    job_id = parser.parse_args()[JOB_ID]
    job = Job.query.filter(Job.id == job_id).first()
    if not job:
        app.logger.error("Job {} doesn't exist".format(job_id))
        abort(404, message="Job {} doesn't exist".format(job_id))
    else:
        return job


class Users(Resource):
    def post(self):
        username = request.json.get('userName')
        password = request.json.get('password')
        if username is None or password is None:
            app.logger.error("Not entered username or password")
            abort(400, message="Enter username and password")
        if User.query.filter_by(userName=username).first() is not None:
            abort(400, message="User with name {} already exists".format(username))
        user = User(username)
        user.hash_password(password)
        user.save()
        return {'status': 'Created', 'userName': username, 'userId': user.id}


class Token(Resource):
    @auth.login_required
    def get(self):
        token = g.user.generate_auth_token()
        return {'token': token.decode('ascii')}


@auth.verify_password
def verify_password(username_or_token, password='qwerty'):
    user = User.verify_auth_token(username_or_token)
    if not user:
        user = User.query.filter_by(userName=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


class Jobs(Resource):
    def get(self):
        """
        Send job by id
        :arg: jobId
        :return: job as JSON with keys:
            id: id of job
            name: name of job
            source1: name of first csv-file
            source2: name of second csv-file
            selectedFields: JSON with keys: 'source1', 'source2'. Values are entities field names
            outputFileName: name of file for results
            creationDate: timestamp
            metric: name of metric
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
        :arg: jobId
        :return: status
        """
        try:
            job = get_job_or_abort()
            job.delete()
            return {'status': 'Deleted'}
        except Exception as e:
            app.logger.exception(e)

    @auth.login_required
    def post(self):
        """
        Add new job and all entities to database
        :arg: JSON with keys: name, source1, source2, selectedFields, outputFileFame, metric
        :return: status, jobId
        """
        try:
            name = request.json.get('name')
            source1 = request.json.get('source1')
            source2 = request.json.get('source2')
            selected_fields = request.json.get('selectedFields')
            output_file_name = request.json.get('outputFileName')
            metric = request.json.get('metric')
            user = g.user.id

            job = Job(name, source1, source2, selected_fields, output_file_name, metric, user)
            job.save()

            with open(job.source1) as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    name = row.pop(job.selectedFields['source1'])
                    entity = Entity(job.id, True, name, row)
                    entity.save()
            with open(job.source2) as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    name = row.pop(job.selectedFields['source2'])
                    entity = Entity(job.id, False, name, row)
                    entity.save()
            return {'status': 'Created', 'jobId': job.id}
        except Exception as e:
            app.logger.exception(e)


class JobList(Resource):
    @auth.login_required
    def get(self):
        """
        Send existing jobs
        :return: list of jobs
        """
        try:
            jobs = Job.query.filter(Job.creator == g.user.id).all()
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
        :arg: filePath
        :return: list of field names
        """
        try:
            file_path = parser.parse_args()['filePath']
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
        sorted_entities = list(map(lambda x: x[1], sorted(res, key=lambda x: -x[0])))
        return sorted_entities
    except Exception as e:
        app.logger.exception(e)


class Entities(Resource):
    def get(self):
        """
        Send entities for job
        :arg: jobId, lastEntityId
        :return: list of entities, where entity is JSON with keys:
            id: id of entity
            name: name of entity
            jobId: id of job
            isFirstSource: Boolean value
            otherFields: JSON with another information about entity
        """
        try:
            job = get_job_or_abort()
            last_entity_id = parser.parse_args()['lastEntityId']
            entity_from_first_source = Entity.query.filter(Entity.jobId == job.id,
                                                           Entity.isFirstSource,
                                                           Entity.isMatched == False,
                                                           Entity.id > last_entity_id).first()
            if entity_from_first_source is None:
                return []
            entity_list = [entity_from_first_source.to_dict()]
            entities_from_second_source = Entity.query.filter(Entity.jobId == job.id,
                                                              Entity.isFirstSource == False,
                                                              Entity.isMatched == False).all()
            if entities_from_second_source is None:
                return []
            entities_from_second_source = sort_by_metric(entity_from_first_source, entities_from_second_source, job.metric)
            for entity in entities_from_second_source:
                entity_list.append(entity.to_dict())
            return entity_list
        except Exception as e:
            app.logger.exception(e)

    def delete(self):
        try:
            entity_id = parser.parse_args()[ENTITY_ID]
            entity = Entity.query.filter(Entity.id == entity_id).first()
            entity.delete()
            return {'status': 'Deleted'}
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
            job_id = entity1.jobId
            match = MatchedEntities(entity1_id, entity2_id, job_id)
            match.save()
            return {'status': 'Matched'}
        except Exception as e:
            app.logger.exception(e)

    def get(self):
        try:
            job_id = parser.parse_args()[JOB_ID]
            matched_entities = MatchedEntities.query.filter(MatchedEntities.jobId == job_id).all()
            res = []
            for match in matched_entities:
                entity1 = Entity.query.filter(Entity.id == match.entity1_id).first().name
                entity2 = Entity.query.filter(Entity.id == match.entity2_id).first().name
                res.append({MATCH_ID: match.id, 'entity1': entity1, 'entity2': entity2})
            return res
        except Exception as e:
            app.logger.exception(e)

    def delete(self):
        try:
            match_id = parser.parse_args()[MATCH_ID]
            match = MatchedEntities.query.filter(MatchedEntities.id == match_id).first()
            entity1 = Entity.query.filter(Entity.id == match.entity1_id).first()
            entity1.isMatched = False
            entity1.save()
            entity2 = Entity.query.filter(Entity.id == match.entity2_id).first()
            entity2.isMatched = False
            entity2.save()
            match.delete()
            return {'status': 'Deleted'}
        except Exception as e:
            app.logger.exception(e)


class SavingResults(Resource):
    def __init__(self):
        self.directory_path = 'entity_matching_tool/result_files/'

    def get(self):
        try:
            job = get_job_or_abort()
            if not os.path.exists(self.directory_path):
                os.makedirs(self.directory_path)
            matched_entities = MatchedEntities.query.filter(MatchedEntities.jobId == job.id).all()
            with open(self.directory_path + job.outputFileName + '.csv', 'w') as csvfile:
                fieldnames = ['entity1', 'entity2']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for match in matched_entities:
                    entity1 = Entity.query.filter(Entity.id == match.entity1_id).first().name
                    entity2 = Entity.query.filter(Entity.id == match.entity2_id).first().name
                    writer.writerow({'entity1': entity1, 'entity2': entity2})
        except Exception as e:
            app.logger.exception(e)


class ChangingMetric(Resource):
    def post(self):
        try:
            job_id = request.json.get(JOB_ID)
            metric = request.json.get('metric')
            job = Job.query.filter(Job.id == job_id).first()
            job.metric = metric
            job.save()
        except Exception as e:
            app.logger.exception(e)

