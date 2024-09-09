import os
from dotenv import load_dotenv
import mongoengine as me
from pymongo.read_preferences import ReadPreference

# Load environment
load_dotenv(dotenv_path=".env")

MONGODB_HOST = os.getenv("DATABASE_URI")

# Connect to the 'test' database for User model
me.connect(
    db='test',
    alias='test_db',
    host=MONGODB_HOST,
    maxPoolSize=100,
    read_preference=ReadPreference.SECONDARY_PREFERRED
)

# Connect to the 'cvanalysis' database for CV model
me.connect(
    db='cvanalysis',
    alias='cvanalysis_db',
    host=MONGODB_HOST,
    maxPoolSize=100,
    read_preference=ReadPreference.SECONDARY_PREFERRED
)

class User(me.Document):
    username = me.StringField(required=True, unique=True)

    meta = {
        'collection': 'users',
        'db_alias': 'test_db'
    }
class CVAnalysis(me.Document):
    file_name = me.StringField(max_length=255, null=True)
    context_score = me.FloatField(null=True)
    user = me.ReferenceField(User, required=True, reverse_delete_rule=me.CASCADE)
    name = me.StringField(max_length=255, null=True)
    designation = me.StringField(max_length=255, null=True)
    experience = me.StringField(max_length=255, null=True)
    education = me.StringField(max_length=255, null=True)
    skills = me.StringField(max_length=255, null=True)
    salary_expectation = me.StringField(max_length=255, null=True)
    description = me.StringField(null=True)
    professional_title = me.StringField(max_length=255, null=True)
    years_of_experience = me.StringField(max_length=255, null=True)

    meta = {
        'collection': 'cv_analysis',
        'db_alias': 'cvanalysis_db'
    }