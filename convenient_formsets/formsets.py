import django
from django import forms
from django.conf import settings
from django.forms.formsets import DELETION_FIELD_NAME, ORDERING_FIELD_NAME


class ConvenientFormsetsBase(object):
    deletion_widget = forms.HiddenInput
    ordering_widget = forms.HiddenInput

    def add_fields(self, form, index):
        """
        Backports overriding of widget for `DELETION_FIELD_NAME` to Django 3.2
        and lower, and widget for `ORDERING_FIELD_NAME` to Django 2.2.
        """
        super().add_fields(form, index)

        if django.VERSION < (4, 0):
            if DELETION_FIELD_NAME in form.fields:
                widget_instance = self.get_deletion_widget()
                form.fields[DELETION_FIELD_NAME].widget = widget_instance

        if django.VERSION < (3, 0):
            if ORDERING_FIELD_NAME in form.fields:
                widget_instance = self.get_ordering_widget()
                form.fields[ORDERING_FIELD_NAME].widget = widget_instance

    @classmethod
    def get_deletion_widget(self):
        """
        Returns an instance of the `deletion_widget` class.
        Note: this method exists to backport the feature to Django 3.2 and lower.
        """
        if django.VERSION < (4, 0):
            return self.deletion_widget()
        else:
            return super().get_deletion_widget()

    @classmethod
    def get_ordering_widget(self):
        """
        Returns an instance of the `ordering_widget` class.
        Note: this method exists to backport the feature to Django 2.2.
        """
        if django.VERSION < (3, 0):
            return self.ordering_widget()
        else:
            return super().get_ordering_widget()

    @property
    def media(self):
        """
        Returns a `Media` object that includes the form's media together with
        the JavaScript required for in-browser interaction.
        """
        js_ext = "min.js" if not settings.DEBUG else "js"
        convenient_formsets_media = forms.Media(
            js=('convenient_formsets/convenient_formsets.{}'.format(js_ext),)
        )
        forms_media = super().media
        return convenient_formsets_media + forms_media


class ConvenientBaseFormSet(ConvenientFormsetsBase, forms.BaseFormSet):
    pass


class ConvenientBaseModelFormSet(ConvenientFormsetsBase, forms.BaseModelFormSet):
    pass


class ConvenientBaseInlineFormSet(ConvenientFormsetsBase, forms.BaseInlineFormSet):
    pass
