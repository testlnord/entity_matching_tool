from entity_matching_tool import app, api
from entity_matching_tool.resources import JobList, Jobs, CsvFiles, FieldNames, Entities, Matching, MetricNames, MainPage
from flask import render_template


api.add_resource(JobList, '/joblist/')
api.add_resource(Jobs, '/jobs/')
api.add_resource(CsvFiles, '/csvfiles')
api.add_resource(FieldNames, '/fieldnames')
api.add_resource(Entities, '/entities/')
api.add_resource(Matching, '/matching/')
api.add_resource(MetricNames, '/metrics/')
#api.add_resource(MainPage, '/')



@app.route('/')
def index():
    logger = logging.getLogger("main.index")
    logger.warning("asdf")
    return render_template('index.html')

app.run(host='0.0.0.0')
