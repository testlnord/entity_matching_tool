from entity_matching_tool import app, api, models
from entity_matching_tool.resources import JobList, Jobs, CsvFiles, FieldNames, Entities, Matching, MetricNames, Users, \
    Token, SavingResults, ChangingMetric, AddSource
from flask import render_template

api.add_resource(JobList, '/joblist/')
api.add_resource(Jobs, '/jobs/')
api.add_resource(CsvFiles, '/csvfiles/')
api.add_resource(FieldNames, '/fieldnames/')
api.add_resource(Entities, '/entities/')
api.add_resource(Matching, '/matching/')
api.add_resource(MetricNames, '/metrics/')
api.add_resource(Users, '/signup/')
api.add_resource(Token, '/login/')
api.add_resource(SavingResults, '/saving/')
api.add_resource(ChangingMetric, '/changemetric/')
api.add_resource(AddSource, '/files/')


@app.route('/')
@app.route('/signin/')
@app.route('/signup/')
@app.route('/joblist/')
@app.route('/jobs/')
@app.route('/csvfiles/')
@app.route('/fieldnames/')
@app.route('/metrics/')
@app.route('/files/')
def index():
    return render_template('index.html')


app.run(host='0.0.0.0', threaded=True)
