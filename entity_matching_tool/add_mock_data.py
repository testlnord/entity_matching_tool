from requests import get, post
from .models import User


if __name__ == "__main__":
    admin = User('admin')
    admin.save()
    csvfiles = get('http://127.0.0.1:5000/csvfiles/').json()
    print('csvfiles: ', csvfiles)
    fieldnames1 = get('http://127.0.0.1:5000/fieldnames/?file_path={}'.format(csvfiles[0])).json()
    print(fieldnames1)
    fieldnames2 = get('http://127.0.0.1:5000/fieldnames/?file_path={}'.format(csvfiles[1])).json()
    print(fieldnames2)
    info = post('http://127.0.0.1:5000/jobs/',
                json=dict(name='job1', source1=csvfiles[0], source2=csvfiles[1],
                          selected_fields=dict(source1=fieldnames1[0], source2=fieldnames2[0]),
                          output_file_name='job1_results')).json()
    print(info)
    entities = get('http://127.0.0.1:5000/entities/?job_id={}'.format(info['job_id'])).json()
    print(entities)
    post('http://127.0.0.1:5000/matching/',
         json=dict(entity1_id=entities[0]['id'], entity2_id=entities[4]['id'])).json()
    post('http://127.0.0.1:5000/matching/',
         json=dict(entity1_id=entities[1]['id'], entity2_id=entities[5]['id'])).json()
    post('http://127.0.0.1:5000/matching/',
         json=dict(entity1_id=entities[2]['id'], entity2_id=entities[3]['id'])).json()
