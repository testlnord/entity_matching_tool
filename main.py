from entity_matching_tool import app, api
from entity_matching_tool.views import JobList, Jobs, CsvFiles, FieldNames, Entities, Matching
from flask import render_template


api.add_resource(JobList, '/joblist/')
api.add_resource(Jobs, '/jobs/')
api.add_resource(CsvFiles, '/csvfiles/')
api.add_resource(FieldNames, '/fieldnames/')
api.add_resource(Entities, '/entities/')
api.add_resource(Matching, '/matching/')


@app.route('/')
def index():
    return render_template('index.html')

app.run()
