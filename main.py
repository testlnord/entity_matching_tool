from entity_matching_tool import app, api, models
from entity_matching_tool.resources import JobList, Jobs, CsvFiles, FieldNames, Entities, Matching, MetricNames, Users, \
    Token, SavingResults, ChangingMetric
from flask import render_template

api.add_resource(JobList, '/joblist/')
api.add_resource(Jobs, '/jobs/')
api.add_resource(CsvFiles, '/csvfiles/')
api.add_resource(FieldNames, '/fieldnames/')
api.add_resource(Entities, '/entities/')
api.add_resource(Matching, '/matching/')
api.add_resource(MetricNames, '/metrics/')
api.add_resource(Users, '/regist/')
api.add_resource(Token, '/login/')
api.add_resource(SavingResults, '/saving/')
api.add_resource(ChangingMetric, '/changemetric/')


@app.route('/')
@app.route('/signin/')
@app.route('/registr/')
@app.route('/joblist/')
@app.route('/jobs/')
@app.route('/csvfiles/')
@app.route('/fieldnames/')
@app.route('/metrics/')
def index():
    return render_template('index.html')


app.run(host='0.0.0.0')