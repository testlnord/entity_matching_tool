from entity_matching_tool.app import app, api
from entity_matching_tool.views import JobList, Jobs

api.add_resource(JobList, '/jobs')
api.add_resource(Jobs, '/jobs/<job_id>')
app.run()


