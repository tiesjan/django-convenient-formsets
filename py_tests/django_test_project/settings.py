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

SECRET_KEY = 'MY_NOT_SO_SECRET_KEY_FOR_TESTING_PURPOSES'

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
        },
    },
]
