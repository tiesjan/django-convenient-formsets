# Django Convenient Formsets

[![Python unit tests](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_python_unit_tests.yml/badge.svg)](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_python_unit_tests.yml)
[![End-to-end tests](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_end_to_end_tests.yml/badge.svg)](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_end_to_end_tests.yml)
[![Linters](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_linters.yml/badge.svg)](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_linters.yml)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=N1BMZUpLMzNxN2VtQ0wrN0VodnMzNDJmdktWS2YwdHJzcmxvZGc3QlNYYz0tLVVWU1UxOWxpS1RkQjJMOGIvVUtiU0E9PQ==--96448b365fd6a2a2102521d9c1fe7fad0eba0d02)](https://automate.browserstack.com/public-build/N1BMZUpLMzNxN2VtQ0wrN0VodnMzNDJmdktWS2YwdHJzcmxvZGc3QlNYYz0tLVVWU1UxOWxpS1RkQjJMOGIvVUtiU0E9PQ==--96448b365fd6a2a2102521d9c1fe7fad0eba0d02)

This Django app aims to make formsets convenient for users and developers
alike. It extends Django's built-in formset classes and includes support for
dynamically adding and removing of forms on the webpage.


## Installation
1. Install using pip:

    ```shell
    $ pip install django-convenient-formsets
    ```

2. Add to `INSTALLED_APPS`:

    ```python
    INSTALLED_APPS = [
        # ...
        'convenient_formsets'
    ]
    ```


## Quick start
1. Create a formset in your Python code:

    ```python
    from django import forms
    from convenient_formsets import ConvenientBaseFormSet


    class EmailForm(forms.Form):
        email = forms.EmailField()

    EmailFormSet = forms.formset_factory(
        EmailForm,
        formset=ConvenientBaseFormset,
        can_delete=True,
        extra=1,
    )

    email_formset = EmailFormSet(prefix='email-formset')
    ```

2. Render formset in your template and add JavaScript code for initialization:

    ```html
    <!doctype html>
    <html>
    <head>
        <!-- Include the formset's media -->
        {{ email_formset.media }}

        <!-- Initialize a ConvenientFormset -->
        <script>
            window.addEventListener('load', function(event) {
                new ConvenientFormset({
                    'formsetPrefix': '{{ email_formset.prefix }}',
                    'formsContainerSelector': '#formset #forms-container',
                    'formSelector': '.form',

                    'canAddForms': true,
                    'addFormButtonSelector': '#formset #add-form-button',
                    'emptyFormSelector': '#formset #empty-form .form',

                    'canAddForms': true,
                    'deleteFormButtonSelector': '#delete-form-button',
                });
            });
        </script>
    </head>

    <body>
        <!-- Render formset using the following basic structure -->
        <div id="email-formset">
            <div id="email-forms-container">
                {% for email_form in email_formset.forms %}
                <div class="email-form">
                    {{ email_form.email }}
                    {% if email_formset.can_delete %}{{ email_form.DELETE }}{% endif %}
                    <input type="button" id="delete-form-button" value="Delete">
                </div>
                {% endfor %}
            </div>
            <div><input type="button" id="add-form-button" value="Add another"></div>
            <div id="empty-form" hidden>
                <div class="email-form">
                    {{ email_formset.empty_form.email }}
                    <input type="button" id="delete-form-button" value="Delete">
                </div>
            </div>
            {{ email_formset.management_form }}
        </div>
    </body>
    </html>
    ```


## Usage

### Server side
The Python classes `ConvenientBaseFormSet` and `ConvenientBaseModelFormSet`
extend Django's built-in `BaseFormSet` and `BaseModelFormset` by:
- Allowing you to override the `delete_widget` property, used for the `DELETE`
  field in formset forms. It defaults to the `forms.HiddenInput` in order to
  hide it from the user.
- Including the JavaScript files required for dynamic formsets.

### Client side
See the example in the Quick start guide above on how to render the formset in
your HTML template. Feel free to add some intermediate DOM elements if it suits
your template better, as long as you stick to the basic structure shown above.

Creating an instance of the JavaScript constructor function `ConvenientFormset`
allows a user to add and delete forms within the rendered formset. When a user
makes changes, the management form is updated accordingly. The constructor
function can be passed the parameters outlined below. In case the initialization
of `ConvenientFormset` fails, check the browser console for some helpful output.

###### GENERAL
<dl>
  <dt>formsetPrefix</dt>
  <dd>The formset's "prefix" property (required).</dd>
  <dt>formsContainerSelector</dt>
  <dd>CSS selector for the DOM element that contains all the forms (required).</dd>
  <dt>formSelector</dt>
  <dd>CSS selector for each form within "formsContainerSelector" (required).</dd>
</dl>

---

###### ADDING FORMS
<dl>
  <dt>canAddForms</dt>
  <dd>Enables adding of new forms (default: true).</dd>
  <dt>addFormButtonSelector</dt>
  <dd>CSS selector for the DOM element that may be clicked to add an empty form (required if "canAddForms" is set).</dd>
  <dt>emptyFormSelector</dt>
  <dd>CSS selector for the empty form (required if "canAddForms" is set).</dd>
  <dt>hideAddFormButtonOnMaxForms</dt>
  <dd>Hides the add button when reaching the maximum number of forms, by applying the "hidden" HTML attribute (default: true).</dd>
</dl>

---

###### DELETING FORMS
<dl>
  <dt>canDeleteForms</dt>
  <dd>Enables deleting of forms (default: false).</dd>
  <dt>deleteFormButtonSelector</dt>
  <dd>CSS selector for the DOM element within "formSelector" that may be clicked to delete a form (required if "canDeleteForms" is set).</dd>
</dl>


## Internals
Form deletion is handled in either of the following ways:
1. If a form includes a `DELETE` field, the field's value is updated and the
   form will be hidden by applying the `hidden` HTML attribute. The deletion
   will then be handled server side.
2. If the form _does not_ include a `DELETE` field, the form is removed from
   the DOM altogether and will not be submitted to the server.


## License
The scripts and documentation in this project are released under the
BSD-3-Clause License.
