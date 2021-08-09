from urllib.parse import urlencode

from selenium.webdriver.common.by import By


def test_adding_forms1(live_server, selenium, is_legacy_edge):
    """
    Test behavior when adding multiple forms to a formset with 0 initial forms,
    while keeping the add form button visible upon reaching the maximum number
    of forms.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/adding_forms_1.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate 6 clicks on `addFormButton` (one too many)
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    for _ in range(6):
        add_form_button.click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_text_values = ['', '', '', '', '']
    expected_order_values = ['1', '2', '3', '4', '5']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 5
    for i, form in enumerate(forms):
        # Label
        assert not len(form.find_elements(By.CSS_SELECTOR, 'label'))

        # Text input
        element = form.find_element(By.CSS_SELECTOR, 'input[type="text"]')
        assert element.get_attribute('id') == f'id_formset-{i}-user'
        assert element.get_attribute('name') == f'formset-{i}-user'
        assert element.get_attribute('value') == f'{expected_text_values[i]}'

        # Delete flag
        assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=DELETE]'))

        # Order index
        element = form.find_element(By.CSS_SELECTOR, 'input[name$="ORDER"]')
        assert element.get_attribute('id') == f'id_formset-{i}-ORDER'
        assert element.get_attribute('name') == f'formset-{i}-ORDER'
        assert element.get_attribute('value') == f'{expected_order_values[i]}'

    # Assert management form values
    total_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')
    assert total_forms_input.get_attribute('value') == '5'
    initial_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')
    assert initial_forms_input.get_attribute('value') == '0'
    min_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does not have the `hidden` attribute set
    if is_legacy_edge(getattr(selenium, 'desired_capabilities', {})):
        assert add_form_button.get_attribute('hidden') == 'false'
    else:
        assert add_form_button.get_attribute('hidden') is None


def test_adding_forms2(live_server, selenium, is_legacy_edge):
    """
    Test behavior when adding a form to a formset with 2 visible forms of 5
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/adding_forms_2.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on add form button
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    add_form_button.click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_text_values = ['user0', 'user1', 'user2', 'user3', 'user4', '']
    expected_delete_values = ['on', '', 'on', '', 'on']
    expected_order_values = ['1', '2', '3', '4', '5', '5']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 6
    for i, form in enumerate(forms):
        # Label
        assert not len(form.find_elements(By.CSS_SELECTOR, 'label'))

        # Text input
        element = form.find_element(By.CSS_SELECTOR, '[type="text"]')
        assert element.get_attribute('name') == f'formset-{i}-user'
        assert element.get_attribute('value') == f'{expected_text_values[i]}'

        # Delete flag
        if i < len(expected_delete_values):  # only for the 5 initial forms
            element = form.find_element(By.CSS_SELECTOR, '[name$=DELETE]')
            assert element.get_attribute('name') == f'formset-{i}-DELETE'
            assert element.get_attribute('value') == f'{expected_delete_values[i]}'
        else:
            assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=DELETE]'))

        # Order index
        element = form.find_element(By.CSS_SELECTOR, '[name$=ORDER]')
        assert element.get_attribute('name') == f'formset-{i}-ORDER'
        assert element.get_attribute('value') == f'{expected_order_values[i]}'

    # Assert management form values
    total_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')
    assert total_forms_input.get_attribute('value') == '6'
    initial_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')
    assert initial_forms_input.get_attribute('value') == '5'
    min_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does not have the `hidden` attribute set
    if is_legacy_edge(getattr(selenium, 'desired_capabilities', {})):
        assert add_form_button.get_attribute('hidden') == 'false'
    else:
        assert add_form_button.get_attribute('hidden') is None


def test_adding_forms3(live_server, selenium, is_legacy_edge):
    """
    Test behavior when adding a form to a formset with 4 visible forms of 4
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/adding_forms_3.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on add form button
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    add_form_button.click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_values = ['user0', 'user1', 'user2', 'user3', '']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 5
    for i, form in enumerate(forms):
        # Label
        element = form.find_element(By.CSS_SELECTOR, 'label')
        assert element.get_attribute('for') == f'id_formset-{i}-user'

        # Text input
        text_input = form.find_element(By.CSS_SELECTOR, 'input[type="text"]')
        assert text_input.get_attribute('id') == f'id_formset-{i}-user'
        assert text_input.get_attribute('value') == f'{expected_values[i]}'

        # Delete flag & order index
        assert not len(form.find_elements(By.CSS_SELECTOR, '[type="hidden"]'))

    # Assert management form values
    total_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')
    assert total_forms_input.get_attribute('value') == '5'
    initial_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')
    assert initial_forms_input.get_attribute('value') == '4'
    min_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does have the `hidden` attribute set
    if is_legacy_edge(getattr(selenium, 'desired_capabilities', {})):
        assert add_form_button.get_attribute('hidden') == 'true'
    else:
        assert add_form_button.get_attribute('hidden') is not None


def test_deleting_forms(live_server, selenium, is_legacy_edge):
    """
    Test behavior when deleting a form from a formset with 5 visible forms of 2
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/deleting_forms.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on delete form button of 2nd & 3rd form
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    forms[1].find_element(By.CSS_SELECTOR, '#delete-form-button').click()
    forms[2].find_element(By.CSS_SELECTOR, '#delete-form-button').click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_text_values = ['user0', 'user1', 'user3', 'user4']
    expected_delete_values = ['', 'on']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 4
    for i, form in enumerate(forms):
        # Label
        assert not len(form.find_elements(By.CSS_SELECTOR, 'label'))

        # Text input
        element = form.find_element(By.CSS_SELECTOR, '[type="text"]')
        assert element.get_attribute('name') == f'formset-{i}-user'
        assert element.get_attribute('value') == f'{expected_text_values[i]}'

        # Delete flag
        if i < len(expected_delete_values):  # only for the 2 initial forms
            element = form.find_element(By.CSS_SELECTOR, '[name$=DELETE]')
            assert element.get_attribute('name') == f'formset-{i}-DELETE'
            assert element.get_attribute('value') == f'{expected_delete_values[i]}'
        else:
            assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=DELETE]'))

        # Order index
        assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=ORDER]'))

    # Assert management form values
    total_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')
    assert total_forms_input.get_attribute('value') == '4'
    initial_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')
    assert initial_forms_input.get_attribute('value') == '2'
    min_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_element(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does not have the `hidden` attribute set
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    if is_legacy_edge(getattr(selenium, 'desired_capabilities', {})):
        assert add_form_button.get_attribute('hidden') == 'false'
    else:
        assert add_form_button.get_attribute('hidden') is None


def test_ordering_forms1(live_server, selenium):
    """
    Test behavior when reordering arbitrary forms.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/ordering_forms_all.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on move form up/down buttons of 1st, 3nd & 5th form
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    forms[0].find_element(By.CSS_SELECTOR, '#move-form-down-button').click()
    forms[2].find_element(By.CSS_SELECTOR, '#move-form-down-button').click()
    forms[4].find_element(By.CSS_SELECTOR, '#move-form-up-button').click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_form_indexes = ['1', '0', '3', '4', '2']
    expected_text_values = ['user1', 'user0', 'user3', 'user4', 'user2']
    expected_order_values = ['1', '2', '3', '4', '5']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 5
    for i, form in enumerate(forms):
        # Label
        assert not len(form.find_elements(By.CSS_SELECTOR, 'label'))

        # Text input
        element = form.find_element(By.CSS_SELECTOR, 'input[type="text"]')
        assert (
            element.get_attribute('name') ==
            f'formset-{expected_form_indexes[i]}-user'
        )
        assert element.get_attribute('value') == f'{expected_text_values[i]}'

        # Delete flag
        assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=DELETE]'))

        # Order index
        element = form.find_element(By.CSS_SELECTOR, 'input[name$="ORDER"]')
        assert (
            element.get_attribute('name') ==
            f'formset-{expected_form_indexes[i]}-ORDER'
        )
        assert element.get_attribute('value') == f'{expected_order_values[i]}'


def test_ordering_forms2(live_server, selenium):
    """
    Test behavior when attempting to move up the first form and move down the
    last form.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/ordering_forms_all.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on move form up button for first and on move form down
    # button for last form
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    forms[0].find_element(By.CSS_SELECTOR, '#move-form-up-button').click()
    forms[-1].find_element(By.CSS_SELECTOR, '#move-form-down-button').click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_form_indexes = ['0', '1', '2', '3', '4']
    expected_text_values = ['user0', 'user1', 'user2', 'user3', 'user4']
    expected_order_values = ['1', '2', '3', '4', '5']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 5
    for i, form in enumerate(forms):
        # Label
        assert not len(form.find_elements(By.CSS_SELECTOR, 'label'))

        # Text input
        element = form.find_element(By.CSS_SELECTOR, 'input[type="text"]')
        assert (
            element.get_attribute('name') ==
            f'formset-{expected_form_indexes[i]}-user'
        )
        assert element.get_attribute('value') == f'{expected_text_values[i]}'

        # Delete flag
        assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=DELETE]'))

        # Order index
        element = form.find_element(By.CSS_SELECTOR, 'input[name$="ORDER"]')
        assert (
            element.get_attribute('name') ==
            f'formset-{expected_form_indexes[i]}-ORDER'
        )
        assert element.get_attribute('value') == f'{expected_order_values[i]}'


def test_combined_form_actions(live_server, selenium):
    """
    Test behavior when combining adding, deleting and ordering multiple forms.
    """
    # Load webpage for test
    params = {'template_name': 'interaction/combined_form_actions.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on delete form button of 2nd & 4th form and on move form
    # up/down buttons of 1st & 5th form
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    forms[1].find_element(By.CSS_SELECTOR, '#delete-form-button').click()
    forms[3].find_element(By.CSS_SELECTOR, '#delete-form-button').click()
    forms[0].find_element(By.CSS_SELECTOR, '#move-form-down-button').click()
    forms[4].find_element(By.CSS_SELECTOR, '#move-form-up-button').click()

    # Initiate click on add form button
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    add_form_button.click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of form elements
    expected_form_indexes = ['2', '4', '0', '1', '3', '5']
    expected_text_values = ['user2', 'user4', 'user0', 'user1', 'user3', '']
    expected_delete_values = ['', '', '', 'on', 'on']
    expected_order_values = ['1', '3', '5', '2', '4', '6']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 6
    for i, form in enumerate(forms):
        # Label
        assert not len(form.find_elements(By.CSS_SELECTOR, 'label'))

        # Text input
        element = form.find_element(By.CSS_SELECTOR, 'input[type="text"]')
        assert (
            element.get_attribute('name') ==
            f'formset-{expected_form_indexes[i]}-user'
        )
        assert element.get_attribute('value') == f'{expected_text_values[i]}'

        # Delete flag
        if i < len(expected_delete_values):  # only for the 5 initial forms
            element = form.find_element(By.CSS_SELECTOR, '[name$=DELETE]')
            assert (
                element.get_attribute('name') ==
                f'formset-{expected_form_indexes[i]}-DELETE'
            )
            assert element.get_attribute('value') == f'{expected_delete_values[i]}'
        else:
            assert not len(form.find_elements(By.CSS_SELECTOR, '[name$=DELETE]'))

        # Order index
        element = form.find_element(By.CSS_SELECTOR, 'input[name$="ORDER"]')
        assert (
            element.get_attribute('name') ==
            f'formset-{expected_form_indexes[i]}-ORDER'
        )
        assert element.get_attribute('value') == f'{expected_order_values[i]}'
