from django.template import TemplateDoesNotExist
from django.template.loader import get_template
from django.views.generic.base import TemplateView


class TestView(TemplateView):
    template_name = 'base.html'

    def get_template_names(self):
        template_name = self.request.GET.get('template_name')

        if template_name:
            try:
                return get_template(template_name)
            except TemplateDoesNotExist:
                pass

        return '404.html'
