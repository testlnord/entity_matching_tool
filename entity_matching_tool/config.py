import os


class BaseConfig(object):
    DEBUG = os.environ.get('DEBUG', True)
    TESTING = False
    SECRET_KEY = 'emtool'
    POSTGRES = {
        'user': 'postgres',
        'pw': 'postgres',
        'db': 'postgres',
        'host': 'db',
        'port': '5432',
    }
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI',
                              'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SERVER_NAME = '0.0.0.0:5000'
    # Mongodb config
    MONGO_DBNAME = 'mongo'
    MONGO = {
                'db': 'mongo',
                'host': 'mongodb',
                'port': '27017',
            }
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://%(host)s:%(port)s/%(db)s' % MONGO)
    # Source files config
    UPLOAD_FOLDER = 'entity_matching_tool/csv_files/'
    ALLOWED_EXTENSIONS = ['csv']

class TestConfig(object):
    DEBUG = os.environ.get('DEBUG', True)
    TESTING = False
    SECRET_KEY = 'emtool'
    POSTGRES = {
        'user': 'postgres',
        'pw': 'postgres',
        'db': 'entity_matching_tool',
        'host': 'localhost',
        'port': '5432',
    }
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI',
                                             'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    #SERVER_NAME = '127.0.0.1:5000'
    # Mongodb config
    MONGO_DBNAME = 'mongo'
    MONGO = {
        'db': 'entity_matching_tool',
        'host': 'localhost',
        'port': '27017',
    }
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://%(host)s:%(port)s/%(db)s' % MONGO)
    # Source files config
    UPLOAD_FOLDER = 'entity_matching_tool/csv_files/'
    ALLOWED_EXTENSIONS = ['csv']




app_config = BaseConfig
test_config = TestConfig