import pytest
from django import forms
from django.templatetags.static import static
from django.forms.formsets import DELETION_FIELD_NAME, ORDERING_FIELD_NAME

from convenient_formsets import formsets


@pytest.fixture
def form_class():
    class PersonalDataForm(forms.Form):
        first_name = forms.CharField()
        last_name = forms.CharField()
        email_address = forms.EmailField()
    return PersonalDataForm


def test_add_fields_default(form_class):
    EmailFormSet = forms.formset_factory(
        form_class,
        formset=formsets.ConvenientBaseFormSet,
        can_delete=True,
        can_order=True,
    )
    formset = EmailFormSet()
    form = form_class()
    formset.add_fields(form, 0)

    assert DELETION_FIELD_NAME in form.fields
    assert isinstance(form.fields[DELETION_FIELD_NAME].widget, forms.HiddenInput)
    assert ORDERING_FIELD_NAME in form.fields
    assert isinstance(form.fields[ORDERING_FIELD_NAME].widget, forms.HiddenInput)


def test_add_fields_custom_widget_classes(form_class):
    class CustomBaseFormSet(formsets.ConvenientBaseFormSet):
        deletion_widget = forms.CheckboxInput
        ordering_widget = forms.TextInput

    EmailFormSet = forms.formset_factory(
        form_class,
        formset=CustomBaseFormSet,
        can_delete=True,
        can_order=True,
    )
    formset = EmailFormSet()
    form = form_class()
    formset.add_fields(form, 0)

    assert DELETION_FIELD_NAME in form.fields
    assert isinstance(form.fields[DELETION_FIELD_NAME].widget, forms.CheckboxInput)
    assert ORDERING_FIELD_NAME in form.fields
    assert isinstance(form.fields[ORDERING_FIELD_NAME].widget, forms.TextInput)


def test_add_fields_custom_widget_instances(form_class):
    class CustomBaseFormSet(formsets.ConvenientBaseFormSet):
        def get_deletion_widget(self):
            return forms.CheckboxInput()

        def get_ordering_widget(self):
            return forms.TextInput()

    EmailFormSet = forms.formset_factory(
        form_class,
        formset=CustomBaseFormSet,
        can_delete=True,
        can_order=True,
    )
    formset = EmailFormSet()
    form = form_class()
    formset.add_fields(form, 0)

    assert DELETION_FIELD_NAME in form.fields
    assert isinstance(form.fields[DELETION_FIELD_NAME].widget, forms.CheckboxInput)
    assert ORDERING_FIELD_NAME in form.fields
    assert isinstance(form.fields[ORDERING_FIELD_NAME].widget, forms.TextInput)


def test_media(form_class, settings):
    EmailFormSet = forms.formset_factory(
        form_class,
        formset=formsets.ConvenientBaseFormSet,
        can_delete=True,
        can_order=True,
    )
    formset = EmailFormSet()

    settings.DEBUG = True
    expected_url = static('convenient_formsets/convenient_formsets.js')
    assert expected_url in str(formset.media['js'])

    settings.DEBUG = False
    expected_url = static('convenient_formsets/convenient_formsets.min.js')
    assert expected_url in str(formset.media['js'])
