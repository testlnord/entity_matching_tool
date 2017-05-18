from requests import get, post

from entity_matching_tool import db
from entity_matching_tool.config import app_config

if __name__ == "__main__":
    db.drop_all()
    db.create_all()
    print(db)

    username = 'admin'
    password = 'qwerty'
    info = post('http://{}/regist/'.format(app_config.SERVER_NAME),
                json=dict(userName=username, password=password)).text
    print(info)
    info = post('http://{}/regist/'.format(app_config.SERVER_NAME),
                json=dict(userName='admin', password='qwerty')).text
    print(info)
    csvfiles = get('http://{}/csvfiles/'.format(app_config.SERVER_NAME)).json()
    print('csvfiles: ', csvfiles)
    fieldnames1 = get('http://{}/fieldnames/?filePath={}'.format(app_config.SERVER_NAME, csvfiles[0])).json()
    print(fieldnames1)
    fieldnames2 = get('http://{}/fieldnames/?filePath={}'.format(app_config.SERVER_NAME, csvfiles[1])).json()
    print(fieldnames2)
    metrics = get('http://{}/metrics/'.format(app_config.SERVER_NAME)).json()
    print(metrics)
    token = get('http://{}/login/'.format(app_config.SERVER_NAME), auth=(username, password)).json()
    print(token)
    info = post('http://{}/jobs/'.format(app_config.SERVER_NAME),
                json=dict(name='job1', source1=csvfiles[0], source2=csvfiles[1],
                          selectedFields=dict(source1=fieldnames1[0], source2=fieldnames2[0]),
                          outputFileName='job1_results', metric=metrics[1]), auth=(token['token'], 'qwerty')).json()
    print(info)
    job = get(
        'http://{}/jobs/?jobId={}'.format(app_config.SERVER_NAME, info['jobId'])).json()
    print(job)
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId=0'.format(app_config.SERVER_NAME, info['jobId'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id']), auth=(username, password)).json()
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId={}'.format(app_config.SERVER_NAME, info['jobId'],
                                                              entities[0]['id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id']), auth=(username, password)).json()
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId={}'.format(app_config.SERVER_NAME, info['jobId'],
                                                              entities[0]['id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id']), auth=(username, password)).json()
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId={}'.format(app_config.SERVER_NAME, info['jobId'],
                                                              entities[0]['id'])).json()
    print(entities)
    matched_entities = get('http://{}/matching/'.format(app_config.SERVER_NAME)).json()
    print(matched_entities)
    jobs = get('http://{}/joblist/'.format(app_config.SERVER_NAME), auth=(username, password)).json()
    print(jobs)

    username = 'guest'
    password = '12345'
    info = post('http://{}/users/'.format(app_config.SERVER_NAME),
                json=dict(userName=username, password=password)).json()
    print(info)
    info = post('http://{}/users/'.format(app_config.SERVER_NAME),
                json=dict(userName='admin', password='qwerty')).json()
    print(info)
    csvfiles = get('http://{}/csvfiles/'.format(app_config.SERVER_NAME)).json()
    print('csvfiles: ', csvfiles)
    fieldnames1 = get('http://{}/fieldnames/?filePath={}'.format(app_config.SERVER_NAME, csvfiles[0])).json()
    print(fieldnames1)
    fieldnames2 = get('http://{}/fieldnames/?filePath={}'.format(app_config.SERVER_NAME, csvfiles[1])).json()
    print(fieldnames2)
    metrics = get('http://{}/metrics/'.format(app_config.SERVER_NAME)).json()
    print(metrics)
    info = post('http://{}/jobs/'.format(app_config.SERVER_NAME),
                json=dict(name='job2', source1=csvfiles[0], source2=csvfiles[1],
                          selectedFields=dict(source1=fieldnames1[0], source2=fieldnames2[0]),
                          outputFileName='job2_results', metric=metrics[1]), auth=(username, password)).json()
    print(info)
    job = get(
        'http://{}/jobs/?jobId={}'.format(app_config.SERVER_NAME, info['jobId'])).json()
    print(job)
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId=0'.format(app_config.SERVER_NAME, info['jobId'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id']), auth=(username, password)).json()
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId={}'.format(app_config.SERVER_NAME, info['jobId'],
                                                              entities[0]['id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id']), auth=(username, password)).json()
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId={}'.format(app_config.SERVER_NAME, info['jobId'],
                                                              entities[0]['id'])).json()
    print(entities)
    post('http://{}/matching/'.format(app_config.SERVER_NAME),
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[1]['id']), auth=(username, password)).json()
    entities = get(
        'http://{}/entities/?jobId={}&lastEntityId={}'.format(app_config.SERVER_NAME, info['jobId'],
                                                              entities[0]['id'])).json()
    print(entities)
    matched_entities = get('http://{}/matching/'.format(app_config.SERVER_NAME)).json()
    print(matched_entities)
    jobs = get('http://{}/joblist/'.format(app_config.SERVER_NAME), auth=(username, password)).json()
    print(jobs)
