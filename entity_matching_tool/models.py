from datetime import datetime
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects.postgresql import JSON
from passlib.apps import custom_app_context as pwd_context

from entity_matching_tool import db, app


class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    source1 = db.Column(db.String())
    source2 = db.Column(db.String())
    selectedFields = db.Column(JSON)
    outputFileName = db.Column(db.String(), unique=True)
    creator = db.Column(db.Integer, db.ForeignKey('users.id'))
    creationDate = db.Column(db.DateTime)
    metric = db.Column(db.String())
    __table_args__ = (UniqueConstraint('name', 'source1', 'source2', name='unique_job_with_sources'),)

    def __init__(self, name, source1, source2, selected_fields, output_file_name, metric,
                 creator, creation_date=None):
        self.name = name
        self.source1 = source1
        self.source2 = source2
        self.selectedFields = selected_fields
        self.outputFileName = output_file_name
        self.metric = metric
        self.creator = creator
        if creation_date:
            self.creationDate = creation_date
        else:
            self.creationDate = datetime.utcnow()

    def __repr__(self):
        return '<Job: "{}">'.format(self.name)

    def to_dict(self):
        job_dict = dict(self.__dict__)
        job_dict.pop('_sa_instance_state', None)
        job_dict['creationDate'] = job_dict['creationDate'].isoformat()
        return job_dict

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Entity(db.Model):
    __tablename__ = 'entities'
    id = db.Column(db.Integer, primary_key=True)
    jobId = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    isFirstSource = db.Column(db.Boolean)
    name = db.Column(db.String())
    otherFields = db.Column(JSON)
    isMatched = db.Column(db.Boolean, default=False)
    __table_args__ = (UniqueConstraint('jobId', 'isFirstSource', 'name', name='unique_entity_in_job'),)

    job = db.relationship('Job', backref=db.backref('entities', lazy='dynamic'))

    def __init__(self, job_id, is_first_source, name, other_fields):
        self.jobId = job_id
        self.isFirstSource = is_first_source
        self.name = name
        self.otherFields = other_fields

    def __repr__(self):
        return '<Entity: "{}">'.format(self.name)

    def to_dict(self):
        entity_dict = dict(self.__dict__)
        entity_dict.pop('_sa_instance_state', None)
        return entity_dict

    def set_as_matched(self):
        self.isMatched = True
        db.session.commit()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class MatchedEntities(db.Model):
    __tablename__ = 'matched_entities'
    entity1_id = db.Column(db.Integer, db.ForeignKey('entities.id'), primary_key=True)
    entity2_id = db.Column(db.Integer, db.ForeignKey('entities.id'), primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('users.id'))
    __table_args__ = (UniqueConstraint('entity1_id', 'entity2_id', 'user', name='unique_matched_entities'),)

    def __init__(self, entity1_id, entity2_id, user):
        self.entity1_id = entity1_id
        self.entity2_id = entity2_id
        self.user = user

    def __repr__(self):
        return '<Matched Entities: {}, {}>'.format(self.entity1_id, self.entity2_id)

    def to_dict(self):
        entity_dict = dict(self.__dict__)
        entity_dict.pop('_sa_instance_state', None)
        return entity_dict

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), unique=True, index=True)
    passwordHash = db.Column(db.String(128))

    def __init__(self, user_name):
        self.userName = user_name

    def __repr__(self):
        return '<User: {}>'.format(self.userName)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def hash_password(self, password):
        self.passwordHash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.passwordHash)

    def generate_auth_token(self, expiration=None):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        user = User.query.get(data['id'])
        return user


db.create_all()
