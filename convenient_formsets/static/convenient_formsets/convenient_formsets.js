/*!
 * Convenient Formsets 0.9.3 (https://github.com/tiesjan/django-convenient-formsets/)
 * Copyright 2021 Ties Jan Hefting
 * Licensed under BSD 3-Clause License
 */
'use strict';


const ConvenientFormset = function(options) {
    /* Available options */
    const availableOptions = {
        // Generic options
        'formsetPrefix': {
            'defaultValue': undefined,
            'requiredIf': 'always',
        },
        'formsContainerSelector': {
            'defaultValue': undefined,
            'requiredIf': 'always',
        },
        'formSelector': {
            'defaultValue': undefined,
            'requiredIf': 'always',
        },

        // Options for adding forms
        'canAddForms': {
            'defaultValue': true,
            'requiredIf': 'never',
        },
        'addFormButtonSelector': {
            'defaultValue': undefined,
            'requiredIf': 'canAddForms',
        },
        'emptyFormSelector': {
            'defaultValue': undefined,
            'requiredIf': 'canAddForms',
        },
        'hideAddFormButtonOnMaxForms': {
            'defaultValue': true,
            'requiredIf': 'never',
        },

        // Options for deleting forms
        'canDeleteForms': {
            'defaultValue': false,
            'requiredIf': 'never',
        },
        'deleteFormButtonSelector': {
            'defaultValue': undefined,
            'requiredIf': 'canDeleteForms',
        },
    };

    /* Formset specific options */
    const formsetOptions = {};

    /* DOM elements */
    const formsetElements = {};
    const managementFormElements = {};


    /* Helper functions */
    function updateAddFormButtonVisibility() {
        /*
         * Updates the visibility of the `addFormButton`: shown when number of
         * visible forms is less than maximum number of forms allowed,
         * otherwise hidden.
         */
        const visibleForms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector + ':not([hidden])'
        );
        const maxNumForms = parseInt(
            managementFormElements.maxNumFormsInput.value, 10
        );
        formsetElements.addFormButton.hidden = !(visibleForms.length < maxNumForms);
    }

    function updateFormIndexes() {
        /*
         * Iterates over all forms in the formset and updates the ID of the
         * `for` attribute of labels and the `id`/`name` attributes of inputs.
         */
        const prefix = formsetOptions.formsetPrefix;
        const idRegex = new RegExp('(' + prefix + '-(\\d+|__prefix__))');

        const forms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector
        );
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i];
            const idReplacement = prefix + '-' + i;

            // Update the `for` attribute for all `label` elements
            const labelElements = form.querySelectorAll('label');
            for (let j = 0; j < labelElements.length; j++) {
                const labelElement = labelElements[j];
                if (labelElement.hasAttribute('for')) {
                    let attrValue = labelElement.getAttribute('for');
                    attrValue = attrValue.replace(idRegex, idReplacement);
                    labelElement.setAttribute('for', attrValue);
                }
            }

            // Update the `id`/`name` attributes for all `input`, `select` and
            // `textarea` elements
            const inputElements = form.querySelectorAll(
                'input, select, textarea'
            );
            for (let j = 0; j < inputElements.length; j++) {
                const inputElement = inputElements[j];
                if (inputElement.hasAttribute('id')) {
                    let attrValue = inputElement.getAttribute('id');
                    attrValue = attrValue.replace(idRegex, idReplacement);
                    inputElement.setAttribute('id', attrValue);
                }
                if (inputElement.hasAttribute('name')) {
                    let attrValue = inputElement.getAttribute('name');
                    attrValue = attrValue.replace(idRegex, idReplacement);
                    inputElement.setAttribute('name', attrValue);
                }
            }
        }
    }

    function updateManagementForm() {
        /*
         * Updates the `TOTAL_FORMS` input in the management form to the number
         * of forms in the formset, regardless of whether it has been marked
         * for deletion. Invoked after forms have been added or removed.
         */
        const allForms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector
        );
        managementFormElements.totalFormsInput.value = allForms.length;
    }


    /* Event handlers */
    function addFormButtonClicked() {
        /*
         * Event handler for clicks on the `addFormButton`. If the total
         * number of visible forms is less than the maximum number of forms
         * allowed, `emptyForm` is cloned and added to `formsContainer`.
         *
         * In case the `hideAddFormButtonOnMaxForms` option is set to `true`,
         * it updates the visibility of the `addFormButton`.
         */
        const visibleForms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector + ':not([hidden])'
        );
        const maxNumForms = parseInt(
            managementFormElements.maxNumFormsInput.value, 10
        );
        if (visibleForms.length >= maxNumForms) {
            return;
        }

        // Clone empty form
        const newForm = formsetElements.emptyForm.cloneNode(true);

        // Add an event listener for clicks on the `deleteFormButton` if forms
        // can be deleted
        if (formsetOptions.canDeleteForms) {
            const deleteFormButton = newForm.querySelector(
                formsetOptions.deleteFormButtonSelector
            );
            deleteFormButton.addEventListener(
                'click', deleteFormButtonClicked.bind(this, newForm)
            );
        }

        // Append form to forms container
        formsetElements.formsContainer.appendChild(newForm);

        // Update visibility of the `addFormButton` if forms can be added
        if (formsetOptions.canAddForms && formsetOptions.hideAddFormButtonOnMaxForms) {
            updateAddFormButtonVisibility();
        }

        // Update the form indexes and the management form
        updateFormIndexes();
        updateManagementForm();
    }

    function deleteFormButtonClicked(form) {
        /*
         * Event handler for clicks on the `deleteFormButton`. Expects `form`
         * as a bound argument. If a DELETE input field is present in the form,
         * it's set to 'on' and the form is hidden. Otherwise the form is
         * removed altogether from the DOM.
         *
         * In case the `hideAddFormButtonOnMaxForms` option is set to `true`,
         * it updates the visibility of the `addFormButton`.
         */
        const deleteField = form.querySelector('input[name$="DELETE"]');
        if (deleteField !== null) {
            deleteField.value = 'on';
            form.hidden = true;
        }
        else {
            formsetElements.formsContainer.removeChild(form);
        }

        // Update visibility of the `addFormButton` if forms can be added
        if (formsetOptions.canAddForms && formsetOptions.hideAddFormButtonOnMaxForms) {
            updateAddFormButtonVisibility();
        }

        // Update the form indexes and the management form
        updateFormIndexes();
        updateManagementForm();
    }

    /* Initialization functions */
    function initializeFormsetOptions(customOptions) {
        /*
         * Initializes `formsetOptions` using given `customOptions`.
         *
         * Failing to specify required options will throw an error.
         */
        const missingOptions = [];

        for (let optionKey in availableOptions) {  // eslint-disable-line prefer-const -- using `let` for IE11
            // Attempt to retrieve option values from `customOptions`, falling
            // back to the default value
            let optionValue;
            if (Object.prototype.hasOwnProperty.call(customOptions, optionKey)) {
                optionValue = customOptions[optionKey];
            }
            else {
                optionValue = availableOptions[optionKey].defaultValue;
            }

            // Store missing required options in `missingOptions`
            const requiredIf = availableOptions[optionKey].requiredIf;
            const optionRequired = (
                (requiredIf === 'always') ||
                (requiredIf === 'canAddForms' && formsetOptions.canAddForms) ||
                (requiredIf === 'canDeleteForms' && formsetOptions.canDeleteForms)
            );
            if (optionRequired && typeof optionValue === 'undefined') {
                missingOptions.push(optionKey);
                continue;
            }

            // Store option value in `formsetOptions`
            formsetOptions[optionKey] = optionValue;
        }

        // Throw error if there are missing required options
        if (missingOptions.length) {
            const formattedMissingOptions = missingOptions.map(
                function(item) { return '`' + item + '`'; }
            ).join(', ');
            const message = (
                'Missing required options: ' + formattedMissingOptions
            );
            throw new Error(message);
        }
    }

    function checkEmptyFormElements() {
        /*
         * Asserts that the empty form has an `deleteFormButton` if forms can
         * be deleted.
         */
        const missingElements = [];
        let element;
        let selector;

        if (formsetOptions.canDeleteForms) {
            selector = formsetOptions.deleteFormButtonSelector;
            element = formsetElements.emptyForm.querySelector(selector);
            if (element === null) {
                missingElements.push(selector);
            }
        }

        // Throw error if DOM elements are missing
        if (missingElements.length) {
            const formattedMissingElements = missingElements.map(
                function(item) { return '`' + item + '`'; }
            ).join(', ');
            const message = (
                'Unable to find DOM elements in empty form with selectors: ' +
                formattedMissingElements
            );
            throw new Error(message);
        }
    }

    function checkVisibleFormsElements() {
        /*
         * Asserts that all visible forms have a `deleteFormButton` if forms
         * can be deleted.
         */
        const missingElements = [];
        let element;
        let selector;

        const forms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector + ':not([hidden])'
        );
        for (let i = 0; i < forms.length; i++) {
            if (formsetOptions.canDeleteForms) {
                const form = forms[i];
                selector = formsetOptions.deleteFormButtonSelector;
                element = form.querySelector(selector);
                if (element === null && missingElements.indexOf(selector) === -1) {
                    missingElements.push(selector);
                }
            }
        }

        // Throw error if DOM elements are missing
        if (missingElements.length) {
            const formattedMissingElements = missingElements.map(
                function(item) { return '`' + item + '`'; }
            ).join(', ');
            const message = (
                'Unable to find DOM elements in one or more visible forms ' +
                'with selectors: ' + formattedMissingElements
            );
            throw new Error(message);
        }
    }

    function selectFormsetElements() {
        /*
         * Initializes `formsetElements` by selecting DOM elements from the
         * formset using the specified selectors.
         *
         * Missing DOM elements will throw an error.
         */
        const missingElements = [];
        let selector;

        // Select DOM elements
        selector = formsetOptions.formsContainerSelector;
        formsetElements.formsContainer = document.querySelector(selector);
        if (formsetElements.formsContainer === null) {
            missingElements.push(selector);
        }

        if (formsetOptions.canAddForms) {
            selector = formsetOptions.emptyFormSelector;
            formsetElements.emptyForm = document.querySelector(selector);
            if (formsetElements.emptyForm === null) {
                missingElements.push(selector);
            }

            selector = formsetOptions.addFormButtonSelector;
            formsetElements.addFormButton = document.querySelector(selector);
            if (formsetElements.addFormButton === null) {
                missingElements.push(selector);
            }
        }

        // Throw error if DOM elements are missing
        if (missingElements.length) {
            const formattedMissingElements = missingElements.map(
                function(item) { return '`' + item + '`'; }
            ).join(', ');
            const message = (
                'Unable to find DOM elements with selectors: ' +
                formattedMissingElements
            );
            throw new Error(message);
        }
    }

    function selectManagementFormElements() {
        /*
         * Initializes `managementFormElements` by selecting the DOM elements
         * from the management form with the specified formset prefix.
         *
         * Missing DOM elements will throw an error.
         */
        let configurationError = false;
        let selector;

        // Select DOM elements
        selector = 'input[name="' + formsetOptions.formsetPrefix + '-TOTAL_FORMS"]';
        managementFormElements.totalFormsInput = document.querySelector(selector);
        if (managementFormElements.totalFormsInput === null) {
            configurationError = true;
        }

        selector = 'input[name="' + formsetOptions.formsetPrefix + '-INITIAL_FORMS"]';
        managementFormElements.initialFormsInput = document.querySelector(selector);
        if (managementFormElements.initialFormsInput === null) {
            configurationError = true;
        }

        selector = 'input[name="' + formsetOptions.formsetPrefix + '-MIN_NUM_FORMS"]';
        managementFormElements.minNumFormsInput = document.querySelector(selector);
        if (managementFormElements.minNumFormsInput === null) {
            configurationError = true;
        }

        selector = 'input[name="' + formsetOptions.formsetPrefix + '-MAX_NUM_FORMS"]';
        managementFormElements.maxNumFormsInput = document.querySelector(selector);
        if (managementFormElements.maxNumFormsInput === null) {
            configurationError = true;
        }

        // Throw error if DOM elements are missing
        if (configurationError) {
            const message = (
                'Management form for formset with prefix `' +
                formsetOptions.formsetPrefix +
                '` missing or has been tampered with.'
            );
            throw new Error(message);
        }
    }

    function hideFormsMarkedForDeletion() {
        /*
         * Hides existing forms that have been marked as deleted.
         */
        const forms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector
        );
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i];
            const deleteField = form.querySelector('input[name$="DELETE"]');
            if (deleteField !== null && deleteField.value === 'on') {
                form.hidden = true;
            }
        }
    }

    function initializeEventListeners() {
        /*
         * Initializes click event listeners for the `addFormButton` and for
         * the `deleteFormButton` of visible forms.
         */
        if (formsetOptions.canAddForms) {
            formsetElements.addFormButton.addEventListener(
                'click', addFormButtonClicked
            );
        }

        const forms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector + ':not([hidden])'
        );
        if (formsetOptions.canDeleteForms) {
            for (let i = 0; i < forms.length; i++) {
                const form = forms[i];
                const deleteFormButton = form.querySelector(
                        formsetOptions.deleteFormButtonSelector);
                deleteFormButton.addEventListener(
                    'click', deleteFormButtonClicked.bind(this, form)
                );
            }
        }
    }

    // Initialize convenient formset
    (function(customOptions) {
        try {
            initializeFormsetOptions(customOptions);
        }
        catch (error) {
            throw Error('[ConvenientFormset] ' + error.message);
        }

        try {
            selectFormsetElements();
        }
        catch (error) {
            throw Error('[ConvenientFormset] ' + error.message);
        }

        try {
            selectManagementFormElements();
        }
        catch (error) {
            throw Error('[ConvenientFormset] ' + error.message);
        }

        if (formsetOptions.canAddForms) {
            try {
                checkEmptyFormElements();
            }
            catch (error) {
                throw Error('[ConvenientFormset] ' + error.message);
            }
        }

        try {
            checkVisibleFormsElements();
        }
        catch (error) {
            throw Error('[ConvenientFormset] ' + error.message);
        }

        if (formsetOptions.canDeleteForms) {
            hideFormsMarkedForDeletion();
        }

        if (formsetOptions.canAddForms && formsetOptions.hideAddFormButtonOnMaxForms) {
            updateAddFormButtonVisibility();
        }

        initializeEventListeners();
    })(options || {});
};
