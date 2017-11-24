import logging
from logging import FileHandler
import psycopg2
import sqlalchemy
from sqlalchemy_utils import database_exists, create_database
from mongoengine import *

from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from .config import test_config
from .config import app_config

app = Flask("Entity matching tool")
# app.config.from_object(test_config)
app.config.from_object(app_config)
db = SQLAlchemy(app)
api = Api(app)

handler = FileHandler('log_file')
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)

# try:
#     mongo = connect(test_config.MONGO['db'])
#     conn = psycopg2.connect("dbname='{}' user='{}' "
#                             "host='{}' password='{}'".format(test_config.POSTGRES['db'],
#                                                              test_config.POSTGRES['user'],
#                                                              test_config.POSTGRES['host'],
#                                                              test_config.POSTGRES['pw']))
# except psycopg2.OperationalError as e:
#     engine = sqlalchemy.create_engine("postgres://{}:{}@{}/{}".format(test_config.POSTGRES['user'],
#                                                                       test_config.POSTGRES['pw'],
#                                                                       test_config.POSTGRES['host'],
#                                                                       test_config.POSTGRES['db']))
#     if not database_exists(engine.url):
#         create_database(engine.url)


try:
    mongo = connect(app_config.MONGO['db'], host=app_config.MONGO['host'])
    conn = psycopg2.connect("dbname='{}' user='{}' "
                            "host='{}' password='{}'".format(app_config.POSTGRES['db'],
                                                             app_config.POSTGRES['user'],
                                                             app_config.POSTGRES['host'],
                                                             app_config.POSTGRES['pw']))
except psycopg2.OperationalError as e:
    engine = sqlalchemy.create_engine("postgres://{}:{}@{}/{}".format(app_config.POSTGRES['user'],
                                                                      app_config.POSTGRES['pw'],
                                                                      app_config.POSTGRES['host'],
                                                                      app_config.POSTGRES['db']))
    if not database_exists(engine.url):
        create_database(engine.url)

