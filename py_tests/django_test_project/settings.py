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

ROOT_URLCONF = 'py_tests.django_test_project.urls'

SECRET_KEY = 'g4p-d0v@+6c5+*%6xac=#3p1cd$-cufg#t!ytjg-fz-a06*7)5'

STATIC_URL = '/static/'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['py_tests/django_test_project/templates/'],
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.template.context_processors.static',
            ]
        }
    },
]
