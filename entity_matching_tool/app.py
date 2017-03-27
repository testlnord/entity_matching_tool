from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

from entity_matching_tool.config import app_config

app = Flask(__name__)
app.config.from_object(app_config)
db = SQLAlchemy(app)
api = Api(app)

if __name__ == "__main__":
    print(app.config['SQLALCHEMY_DATABASE_URI'])
    app.run()
