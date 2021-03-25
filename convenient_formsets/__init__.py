import django

from .formsets import ConvenientBaseFormSet, ConvenientBaseModelFormSet


__all__ = ('ConvenientBaseFormSet', 'ConvenientBaseModelFormSet')


if django.VERSION < (3, 2):
    default_app_config = 'convenient_formsets.apps.ConvenientFormsetsConfig'
