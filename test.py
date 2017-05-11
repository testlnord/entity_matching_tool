from requests import get, post

from entity_matching_tool.models import User
from entity_matching_tool.config import app_config
from entity_matching_tool import db

if __name__ == "__main__":
    db.drop_all()

    db.create_all()
    admin = User('admin')
    admin.save()
    csvfiles = get('http://{}/csvfiles/'.format(app_config.SERVER_NAME)).json()
    print('csvfiles: ', csvfiles)
    fieldnames1 = get('http://{}/fieldnames/?file_path={}'.format(app_config.SERVER_NAME, csvfiles[0])).json()
    print(fieldnames1)
    fieldnames2 = get('http://{}/fieldnames/?file_path={}'.format(app_config.SERVER_NAME, csvfiles[1])).json()
    print(fieldnames2)
    metrics = get('http://{}/metrics/'.format(app_config.SERVER_NAME)).json()
    print(metrics)
    info = post('http://{}/jobs/'.format(app_config.SERVER_NAME),
                json=dict(name='job1', source1=csvfiles[0], source2=csvfiles[1],
                          selected_fields=dict(source1=fieldnames1[0], source2=fieldnames2[0]),
                          output_file_name='job1_results', metric=metrics[1])).json()
    print(info)
    entities = get(
        'http://{}/entities/?job_id={}&last_entity_id=0'.format(app_config.SERVER_NAME, info['job_id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id'])).json()
    entities = get(
        'http://{}/entities/?job_id={}&last_entity_id={}'.format(app_config.SERVER_NAME, info['job_id'],
                                                                 entities[0]['id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id'])).json()
    entities = get(
        'http://{}/entities/?job_id={}&last_entity_id={}'.format(app_config.SERVER_NAME, info['job_id'],
                                                                 entities[0]['id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id'])).json()
    entities = get(
        'http://{}/entities/?job_id={}&last_entity_id={}'.format(app_config.SERVER_NAME, info['job_id'],
                                                                 entities[0]['id'])).json()
    print(entities)
    matched_entities = get('http://{}/matching/'.format(app_config.SERVER_NAME)).json()
    print(matched_entities)

