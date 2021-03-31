DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}

INSTALLED_APPS = (
    'django.contrib.staticfiles',
    'convenient_formsets',
)

SECRET_KEY = 'g4p-d0v@+6c5+*%6xac=#3p1cd$-cufg#t!ytjg-fz-a06*7)5'

STATIC_URL = '/static/'
