import pytest
from django import forms
from django.templatetags.static import static
from django.forms.formsets import DELETION_FIELD_NAME

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
        can_delete=True
    )
    formset = EmailFormSet()
    form = form_class()
    formset.add_fields(form, 0)

    assert DELETION_FIELD_NAME in form.fields
    assert isinstance(form.fields[DELETION_FIELD_NAME].widget, forms.HiddenInput)


def test_add_fields_custom_delete_widget(form_class):
    class CustomBaseFormSet(formsets.ConvenientBaseFormSet):
        delete_widget = forms.CheckboxInput

    EmailFormSet = forms.formset_factory(
        form_class,
        formset=CustomBaseFormSet,
        can_delete=True
    )
    formset = EmailFormSet()
    form = form_class()
    formset.add_fields(form, 0)

    assert DELETION_FIELD_NAME in form.fields
    assert isinstance(form.fields[DELETION_FIELD_NAME].widget, forms.CheckboxInput)


def test_media(form_class):
    EmailFormSet = forms.formset_factory(
        form_class,
        formset=formsets.ConvenientBaseFormSet,
        can_delete=True
    )
    formset = EmailFormSet()

    expected_url = static('convenient_formsets/convenient_formsets.js')
    assert expected_url in str(formset.media['js'])
