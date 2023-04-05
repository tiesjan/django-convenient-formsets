# Changes

## Version 2.0
- **BREAKING:** empty forms are now expected to appear inside the `<template>`
  tag instead of any other hidden tag. As such, the `emptyFormSelector`
  parameter has been renamed to `emptyFormTemplateSelector`. See updated usage
  documentation for an example.
- **BREAKING:** Drop support for Django versions below 4.2
- **BREAKING:** Drop support for Python versions below 3.8
- **BREAKING:** Drop support for IE11 browser
- Only latest desktop browsers are now tested for simplicity, minimal browser
  versions are no longer guaranteed
- Add support for JavaScript events when adding or deleting forms in formsets
  (thanks to @CleitonDeLima)
- Add support for JavaScript events when reordering forms in formsets
- Annotate Python code with typing hints

## Version 1.2.1
- Fixes in Changelog and include it when packaging

## Version 1.2
- Add support for Django 4.1
- Fix spelling in documentation

## Version 1.1.1
- Fixes in packaging of library

## Version 1.1
- Add support for Django 4.0
- Add support for InlineFormSets (thanks to @joahim)
- Bump minimum supported Edge version to 79
- Fix bug in `get_deletion_widget()` backport

## Version 1.0
- Stable version

## Version 0.9.4
- The server side formsets and the corresponding client side plugin now
  has support for ordering of forms.

  On the client side, this can be enabled by setting the `canOrderForms`
  setting, together with the CSS selectors for clickable HTML elements to
  move forms up and down.

  On the server side, both the existing `ordering_widget` and the upcoming
  `deletion_widget` (from Django 4.0) have been backported to earlier
  versions. The `delete_widget` attribute has been renamed accordingly.

## Version 0.9.3
- The configuration of the client side plugin has been revised. The new
  parameters `canAddForms` (default: true) and `canDeleteForms` (default:
  false) must now be used to enable or disable functionality.
- Upon initialization, the plugin now also performs more checks on the
  presence of required DOM elements. This allows developers to catch
  configuration errors quickly.
- When `DEBUG` is set to False, the minified version of the JavaScript
  code is now loaded in order to reduce file size.

## Version 0.9.2
- Exclude tests when packaging

## Version 0.9.1
- Fix packaging configuration

## Version 0.9
- Initial Beta version
