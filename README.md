# Django Convenient Formsets

[![Python unit tests](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_python_unit_tests.yml/badge.svg)](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_python_unit_tests.yml)
[![End-to-end tests](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_end_to_end_tests.yml/badge.svg)](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_end_to_end_tests.yml)
[![Linters](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_linters.yml/badge.svg)](https://github.com/tiesjan/django-convenient-formsets/actions/workflows/run_linters.yml)
[![TestingBot Test Status](https://testingbot.com/buildstatus/e67ac1c27fb0bd343c6f9ec32707a626)](https://testingbot.com/builds/e67ac1c27fb0bd343c6f9ec32707a626)


This Django app aims to make dynamic formsets convenient for users and
developers alike. It extends Django's built-in formset classes and includes
support for adding, deleting and ordering of forms on the client side.


#### Supported platforms
- Django: 4.0, 3.2, 3.1, 3.0, 2.2
- Python: 3.10, 3.9, 3.8, 3.7, 3.6, 3.5
- Browsers: Chrome 48+, Firefox 44+, Internet Explorer 11, Edge 79+, Opera 50+,
  Safari 11+, latest Safari on iOS, latest Chrome on Android

Other platform versions may work, but are not actively tested.


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
    from convenient_formsets import ConvenientBaseFormSet
    from django import forms


    class EmailForm(forms.Form):
        email = forms.EmailField()

    EmailFormSet = forms.formset_factory(
        EmailForm,
        formset=ConvenientBaseFormset,
        can_delete=True,
        can_order=True,
    )

    email_formset = EmailFormSet(prefix='email-formset')
    ```

2. Render formset in your template and add JavaScript code for initialization:

    ```htmldjango
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
                    'formsContainerSelector': '#email-formset #email-forms-container',
                    'formSelector': '.email-form',

                    'canAddForms': true,
                    'addFormButtonSelector': '#email-formset #add-form-button',
                    'emptyFormSelector': '#email-formset #empty-form .email-form',

                    'canDeleteForms': true,
                    'deleteFormButtonSelector': '#delete-form-button',

                    'canOrderForms': true,
                    'moveFormDownButtonSelector': '#move-form-down-button',
                    'moveFormUpButtonSelector': '#move-form-up-button',
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
                    {% if email_formset.can_delete %}
                        {{ email_form.DELETE }}
                        <input type="button" id="delete-form-button" value="Delete">
                    {% endif %}
                    {% if email_formset.can_order %}
                        {{ email_form.ORDER }}
                        <input type="button" id="move-form-up-button" value="Move up">
                        <input type="button" id="move-form-down-button" value="Move down">
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            <div><input type="button" id="add-form-button" value="Add another"></div>
            <div id="empty-form" hidden>
                <div class="email-form">
                    {{ email_formset.empty_form.email }}
                    {% if email_formset.can_delete %}
                        <input type="button" id="delete-form-button" value="Delete">
                    {% endif %}
                    {% if email_formset.can_order %}
                        {{ email_form.ORDER }}
                        <input type="button" id="move-form-up-button" value="Move up">
                        <input type="button" id="move-form-down-button" value="Move down">
                    {% endif %}
                </div>
            </div>
            {{ email_formset.management_form }}
        </div>
    </body>
    </html>
    ```


## Usage

### Server side
The Python classes `ConvenientBaseFormSet`, `ConvenientBaseModelFormSet` and
`ConvenientBaseInlineFormSet` extend Django's built-in `BaseFormSet`,
`BaseModelFormset` and `BaseInlineFormSet` by:
- Overriding `deletion_widget` for the `DELETE` field and `ordering_widget` for
  the `ORDER` field. They default to the `forms.HiddenInput` widget in order to
  hide them from the user.  
  _**Note:** the [`deletion_widget` attribute and corresponding method][1] are
  available from Django 4.0 and later, and the [`ordering_widget` attribute and
  corresponding method][2] are available from Django 3.0 and later. They are
  backported to older Django versions for your convenience._
- Including the JavaScript file in the formset's `media` attribute required
  for dynamic formsets.

[1]: https://docs.djangoproject.com/en/dev/topics/forms/formsets/#deletion-widget
[2]: https://docs.djangoproject.com/en/dev/topics/forms/formsets/#ordering-widget


### Client side
See the example in the Quick start guide above on how to render the formset in
your HTML template. Feel free to add some intermediate DOM elements if it suits
your template better, as long as you stick to the basic structure shown above.

Creating an instance of the JavaScript constructor function `ConvenientFormset`
allows a user to add and delete forms within the rendered formset. When a user
makes changes, the management form is updated accordingly. The constructor
function can be passed the parameters outlined below. In case initialization
fails, check the browser console for some helpful output.

###### GENERAL
<dl>
  <dt>formsetPrefix</dt>
  <dd>The formset's "prefix" attribute (required).</dd>
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

---

###### ORDERING FORMS
<dl>
  <dt>canOrderForms</dt>
  <dd>Enables ordering of forms (default: false).</dd>
  <dt>moveFormDownButtonSelector</dt>
  <dd>CSS selector for the DOM element within "formSelector" that may be clicked to move a form down among the visible forms (required if "canOrderForms" is set).</dd>
  <dt>moveFormUpButtonSelector</dt>
  <dd>CSS selector for the DOM element within "formSelector" that may be clicked to move a form up among the visible forms (required if "canOrderForms" is set).</dd>
</dl>


## Internals
**Form deletion** is handled in either of the following ways:
1. If a form includes a `DELETE` field, the field's value is updated and the
   form will be hidden by applying the "hidden" HTML attribute. The deletion
   will then be handled server side.
2. If the form _does not_ include a `DELETE` field, the form is removed from
   the DOM altogether and will not be submitted to the server.

**Form ordering** is handled by moving visible forms above the previous (up)
and below the next (down) for visual feedback, and by swapping the values of
their `ORDER` fields for the server side. This means that the original values
are kept, even when in-between forms are deleted. New forms will see the
initial value for their `ORDER` field set to the last visible form's `ORDER`
field value + 1, as they're added to the bottom of all forms.


## License
The scripts and documentation in this project are released under the
BSD-3-Clause License.
