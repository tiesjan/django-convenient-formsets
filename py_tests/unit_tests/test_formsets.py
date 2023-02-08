import pytest
from django import forms
from django.templatetags.static import static

from convenient_formsets import formsets


@pytest.fixture
def form_class():
    class PersonalDataForm(forms.Form):
        first_name = forms.CharField()
        last_name = forms.CharField()
        email_address = forms.EmailField()

    return PersonalDataForm


def test_media(form_class, settings):
    EmailFormSet = forms.formset_factory(
        form_class,
        formset=formsets.ConvenientBaseFormSet,
        can_delete=True,
        can_order=True,
    )
    formset = EmailFormSet()

    settings.DEBUG = True
    expected_url = static("convenient_formsets/convenient_formsets.js")
    assert expected_url in str(formset.media["js"])

    settings.DEBUG = False
    expected_url = static("convenient_formsets/convenient_formsets.min.js")
    assert expected_url in str(formset.media["js"])
