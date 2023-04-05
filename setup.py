import setuptools

with open("README.md", "r", encoding="utf-8") as f:
    LONG_DESCRIPTION = f.read()


setuptools.setup(
    # Metadata
    name="django-convenient-formsets",
    version="2.0",
    license="BSD",
    author="Ties Jan Hefting",
    author_email="hello@tiesjan.com",
    description="Django dynamic formsets made convenient for users and developers alike.",
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    url="https://github.com/tiesjan/django-convenient-formsets",
    project_urls={
        "Bugs": "https://github.com/tiesjan/django-convenient-formsets/issues",
        "Changes": "https://github.com/tiesjan/django-convenient-formsets/blob/main/CHANGES.md",
    },
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Framework :: Django :: 4.2",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Internet :: WWW/HTTP",
    ],
    # Options
    packages=setuptools.find_packages(exclude=("py_tests*",)),
    include_package_data=True,
    zip_safe=False,
    python_requires=">=3.8",
    install_requires=("Django>=4.2",),
)
