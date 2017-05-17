from entity_matching_tool import app, api
from entity_matching_tool.resources import JobList, Jobs, CsvFiles, FieldNames, Entities, Matching, MetricNames, Users
from flask import render_template


api.add_resource(JobList, '/joblist/')
api.add_resource(Jobs, '/jobs/')
api.add_resource(CsvFiles, '/csvfiles/')
api.add_resource(FieldNames, '/fieldnames/')
api.add_resource(Entities, '/entities/')
api.add_resource(Matching, '/matching/')
api.add_resource(MetricNames, '/metrics/')
api.add_resource(Users, '/users/')


@app.route('/')
def index():
    return render_template('index.html')

app.run()
