from django import forms
from django.forms.formsets import DELETION_FIELD_NAME


class ConvenientFormsetsBase(object):
    delete_widget = forms.HiddenInput

    def add_fields(self, form, index):
        """
        Override widget for `DELETION_FIELD_NAME`.
        """
        super(ConvenientFormsetsBase, self).add_fields(form, index)

        if DELETION_FIELD_NAME in form.fields:
            form.fields[DELETION_FIELD_NAME].widget = self.get_delete_widget()

    def get_delete_widget(self):
        """
        Returns an instance of `delete_widget`.
        """
        return self.delete_widget()

    @property
    def media(self):
        """
        Returns a `Media` object that includes the form's media together with
        the JavaScript required for in-browser interaction.
        """
        convenient_formsets_media = forms.Media(
            js=('convenient_formsets/convenient_formsets.js',)
        )
        forms_media = super(ConvenientFormsetsBase, self).media
        return convenient_formsets_media + forms_media


class ConvenientBaseFormSet(ConvenientFormsetsBase, forms.BaseFormSet):
    pass


class ConvenientBaseModelFormSet(ConvenientFormsetsBase, forms.BaseModelFormSet):
    pass
