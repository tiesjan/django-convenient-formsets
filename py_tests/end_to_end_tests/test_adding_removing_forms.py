from urllib.parse import urlencode

from selenium.webdriver.common.by import By


def test_adding_form1(live_server, selenium):
    """
    Test behavior when adding a form to a formset with 2 visible forms of 2
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'adding_removing_forms/adding_form_1.html'}
    test_url = f'{live_server.url}?{urlencode(params)}'
    selenium.get(test_url)

    # Initiate click on `addFormButton`
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    add_form_button.click()

    # Assert errors
    error_log = selenium.find_element(By.CSS_SELECTOR, '#error-log')
    error_messages = [
        msg.strip() for msg in error_log.text.split('\n') if msg.strip()
    ]
    assert error_messages == []

    # Assert attributes of text input
    expected_values = ['user0', 'user1', '']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 3
    for i, form in enumerate(forms):
        text_input = form.find_elements(By.CSS_SELECTOR, 'input[type="text"]')[0]
        assert text_input.get_attribute('id') == f'id_formset-{i}-user'
        assert text_input.get_attribute('name') == f'formset-{i}-user'
        assert text_input.get_attribute('value') == f'{expected_values[i]}'

    # Assert management form values
    total_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')[0]
    assert total_forms_input.get_attribute('value') == '3'
    initial_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')[0]
    assert initial_forms_input.get_attribute('value') == '2'
    min_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')[0]
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')[0]
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does not have the `hidden` attribute set
    assert add_form_button.get_attribute('hidden') is None


def test_adding_form2(live_server, selenium):
    """
    Test behavior when adding a form to a formset with 2 visible forms of 5
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'adding_removing_forms/adding_form_2.html'}
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

    # Assert attributes of text input
    expected_values = ['user0', 'user1', 'user2', 'user3', 'user4', '']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 6
    for i, form in enumerate(forms):
        text_input = form.find_elements(By.CSS_SELECTOR, 'input[type="text"]')[0]
        assert text_input.get_attribute('name') == f'formset-{i}-user'
        assert text_input.get_attribute('value') == f'{expected_values[i]}'

    # Assert management form values
    total_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')[0]
    assert total_forms_input.get_attribute('value') == '6'
    initial_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')[0]
    assert initial_forms_input.get_attribute('value') == '5'
    min_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')[0]
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')[0]
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does not have the `hidden` attribute set
    assert add_form_button.get_attribute('hidden') is None


def test_adding_form3(live_server, selenium):
    """
    Test behavior when adding a form to a formset with 4 visible forms of 4
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'adding_removing_forms/adding_form_3.html'}
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

    # Assert attributes of label element and text input
    expected_values = ['user0', 'user1', 'user2', 'user3', '']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 5
    for i, form in enumerate(forms):
        label_element = form.find_elements(By.CSS_SELECTOR, 'label')[0]
        assert label_element.get_attribute('for') == f'id_formset-{i}-user'
        text_input = form.find_elements(By.CSS_SELECTOR, 'input[type="text"]')[0]
        assert text_input.get_attribute('id') == f'id_formset-{i}-user'
        assert text_input.get_attribute('value') == f'{expected_values[i]}'

    # Assert management form values
    total_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')[0]
    assert total_forms_input.get_attribute('value') == '5'
    initial_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')[0]
    assert initial_forms_input.get_attribute('value') == '4'
    min_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')[0]
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')[0]
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does have the `hidden` attribute set
    assert add_form_button.get_attribute('hidden') is not None


def test_deleting_form1(live_server, selenium):
    """
    Test behavior when adding a form to a formset with 4 visible forms of 4
    initial forms.
    """
    # Load webpage for test
    params = {'template_name': 'adding_removing_forms/deleting_form_1.html'}
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

    # Assert attributes of label element and text input
    expected_values = ['user0', 'user1', 'user3', 'user4']
    forms = selenium.find_elements(
            By.CSS_SELECTOR, '#formset #forms-container .form')
    assert len(forms) == 4
    for i, form in enumerate(forms):
        text_input = form.find_elements(By.CSS_SELECTOR, 'input[type="text"]')[0]
        assert text_input.get_attribute('name') == f'formset-{i}-user'
        assert text_input.get_attribute('value') == f'{expected_values[i]}'

    # Assert management form values
    total_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-TOTAL_FORMS"]')[0]
    assert total_forms_input.get_attribute('value') == '4'
    initial_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-INITIAL_FORMS"]')[0]
    assert initial_forms_input.get_attribute('value') == '2'
    min_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MIN_NUM_FORMS"]')[0]
    assert min_num_forms_input.get_attribute('value') == '0'
    max_num_forms_input = selenium.find_elements(
            By.CSS_SELECTOR, 'input[name="formset-MAX_NUM_FORMS"]')[0]
    assert max_num_forms_input.get_attribute('value') == '5'

    # Assert that add form button does not have the `hidden` attribute set
    add_form_button = selenium.find_element(
            By.CSS_SELECTOR, '#formset #add-form-button')
    assert add_form_button.get_attribute('hidden') is None
