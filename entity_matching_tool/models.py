from datetime import datetime

from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects.postgresql import JSON

from entity_matching_tool.app import db


class Job(db.Model):
    __tablename__ = 'job'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    source1 = db.Column(db.String())
    source2 = db.Column(db.String())
    selected_fields = db.Column(JSON)
    output_file_name = db.Column(db.String(), unique=True)
    creator = db.Column(db.Integer, db.ForeignKey('user.id'))
    creation_date = db.Column(db.DateTime)
    __table_args__ = (UniqueConstraint('name', 'source1', 'source2', name='unique_job_with_sources'),)

    def __init__(self, id, name, source1, source2, selected_fields, output_file_name,
                 creator, creation_date=None):
        self.id = id
        self.name = name
        self.source1 = source1
        self.source2 = source2
        self.selected_fields = selected_fields
        self.output_file_name = output_file_name
        self.creator = creator
        if creation_date:
            self.creation_date = creation_date
        else:
            self.creation_date = datetime.utcnow()

    def __repr__(self):
        return '<Job: "{}">'.format(self.name)


class Entity(db.Model):
    __tablename__ = 'entity'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'))
    is_first_source = db.Column(db.Boolean)
    name = db.Column(db.String())
    other_fields = db.Column(JSON)
    __table_args__ = (UniqueConstraint('job_id', 'is_first_source', 'name', name='unique_entity_in_job'),)

    job = db.relationship('Job', backref=db.backref('entities', lazy='dynamic'))

    def __init__(self, id, job_id, is_first_source, name, other_fields):
        self.id = id
        self.job_id = job_id
        self.is_first_source = is_first_source
        self.name = name
        self.other_fields = other_fields

    def __repr__(self):
        return '<Entity: "{}">'.format(self.name)


class MatchedEntities(db.Model):
    __tablename__ = 'matched_entities'
    entity1_id = db.Column(db.Integer, db.ForeignKey('entity.id'), primary_key=True)
    entity2_id = db.Column(db.Integer, db.ForeignKey('entity.id'), primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    __table_args__ = (UniqueConstraint('entity1_id', 'entity2_id', 'user', name='unique_matched_entities'),)

    def __init__(self, entity1_id, entity2_id, user):
        self.entity1_id = entity1_id
        self.entity2_id = entity2_id
        self.user = user

    def __repr__(self):
        return '<Matched Entities: {}, {}>'.format(self.entity1_id, self.entity2_id)


class User(db.Model):
    __tablename__ = 'user'
    user_name = db.Column(db.String(80), unique=True)
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, user_name, id):
        self.user_name = user_name
        self.id = id

    def __repr__(self):
        return '<User: {}>'.format(self.user_name)


if __name__ == "__main__":
    db.create_all()