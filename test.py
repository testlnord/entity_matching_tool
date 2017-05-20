from requests import get, post, delete

from entity_matching_tool import db
from entity_matching_tool.config import app_config

if __name__ == "__main__":
    username = 'admin'
    password = 'qwerty'
    info = post('http://{}/regist/'.format(app_config.SERVER_NAME),
                json=dict(userName=username, password=password)).text
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
    post('http://{}/changemetric/'.format(app_config.SERVER_NAME),json=dict(jobId=1, metric='Simple'))
    jl = get('http://{}/joblist/'.format(app_config.SERVER_NAME), auth=(token['token'], 'qwerty')).json()
    print(jl)



