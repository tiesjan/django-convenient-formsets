import django

from .formsets import (
    ConvenientBaseFormSet, ConvenientBaseModelFormSet,
    ConvenientBaseInlineFormSet
)


__all__ = (
    'ConvenientBaseFormSet', 'ConvenientBaseModelFormSet',
    'ConvenientBaseInlineFormSet'
)


if django.VERSION < (3, 2):
    default_app_config = 'convenient_formsets.apps.ConvenientFormsetsConfig'
