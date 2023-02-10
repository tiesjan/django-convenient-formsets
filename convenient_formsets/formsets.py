from django import forms  # type: ignore[import]
from django.conf import settings  # type: ignore[import]


class ConvenientFormsetsBase:
    deletion_widget = forms.HiddenInput
    ordering_widget = forms.HiddenInput

    @property
    def media(self) -> forms.Media:
        """
        Returns a `Media` object that includes the form's media together with
        the JavaScript required for in-browser interaction.
        """
        js_extension = "min.js" if not settings.DEBUG else "js"
        convenient_formsets_media = forms.Media(
            js=(f"convenient_formsets/convenient_formsets.{js_extension}",)
        )
        forms_media = super().media  # type: ignore[misc]
        return convenient_formsets_media + forms_media


class ConvenientBaseFormSet(ConvenientFormsetsBase, forms.BaseFormSet):
    pass


class ConvenientBaseModelFormSet(ConvenientFormsetsBase, forms.BaseModelFormSet):
    pass


class ConvenientBaseInlineFormSet(ConvenientFormsetsBase, forms.BaseInlineFormSet):
    pass
