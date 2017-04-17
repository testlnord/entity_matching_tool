from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from .config import app_config

app = Flask("Entity matching tool")
app.config.from_object(app_config)
db = SQLAlchemy(app)
api = Api(app)


