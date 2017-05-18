from entity_matching_tool.models import User, Job, Entity, MatchedEntities
from entity_matching_tool import db

if __name__ == "__main__":
    db.create_all()
    admin = User('admin')
    admin.save()
    job = Job(name='job1',
              source1='entity_matching_tool/csv_files/company_info.csv',
              source2='entity_matching_tool/csv_files/customers.csv',
              selected_fields={"source2": "company", "source1": "company_name"},
              output_file_name='job1_results',
              creator=1,
              metric=1)
    job.save()
    e1 = Entity(job_id=1,
                is_first_source=True,
                name='Tesla Motors',
                other_fields={"founders": "Elon Musk, JB Straubel, Martin Eberhard, Marc Tarpenning, Ian Wright",
                              "industry": "Automotive/Energy Storage", "founded": "July 1, 2003"})
    e2 = Entity(job_id=1,
                is_first_source=True,
                name='Volkswagen',
                other_fields={"founders": "German Labour Front", "industry": "Automotive", "founded": "May 28, 1937"})
    e3 = Entity(job_id=1,
                is_first_source=True,
                name='Toyota Motor Corporation',
                other_fields={"founders": "Kiichiro Toyoda", "industry": "Automotive", "founded": "August 28, 1937"})
    e4 = Entity(job_id=1,
                is_first_source=False,
                name='Toyota',
                other_fields={"product": "WebStorm", "transaction_amount": "100"})
    e5 = Entity(job_id=1,
                is_first_source=False,
                name='Tesla, Inc.',
                other_fields={"product": "IntelliJ IDEA", "transaction_amount": "300"})
    e6 = Entity(job_id=1,
                is_first_source=False,
                name='Volkswagen AG',
                other_fields={"product": "PhpStorm", "transaction_amount": "200"})
    e1.save()
    e2.save()
    e3.save()
    e4.save()
    e5.save()
    e6.save()
    me1 = MatchedEntities(entity1_id=1,
                          entity2_id=5,
                          user=1)
    me2 = MatchedEntities(entity1_id=2,
                          entity2_id=6,
                          user=1)
    me3 = MatchedEntities(entity1_id=3,
                          entity2_id=4,
                          user=1)
    me1.save()
    me2.save()
    me3.save()
