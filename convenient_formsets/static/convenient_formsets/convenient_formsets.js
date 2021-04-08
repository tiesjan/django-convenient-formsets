'use strict';


const ConvenientFormset = function(options) {
    /* Default options */
    const defaultOptions = {
        // Required
        'formsetPrefix': undefined,
        'formsContainerSelector': undefined,
        'formSelector': undefined,
        'emptyFormSelector': undefined,
        'addFormButtonSelector': undefined,

        // Optional
        'deleteFormButtonSelector': null,
        'hideAddFormButtonOnMaxForms': true,
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

        // Clone and append empty form, adding an event listener for clicks on
        // the `deleteFormButton` if present
        const newForm = formsetElements.emptyForm.cloneNode(true);
        formsetElements.formsContainer.appendChild(newForm);
        const deleteFormButton = newForm.querySelector(
            formsetOptions.deleteFormButtonSelector
        );
        if (deleteFormButton !== null) {
            deleteFormButton.addEventListener(
                'click', deleteFormButtonClicked.bind(this, newForm)
            );
        }

        // Update visibility of the `addFormButton`
        if (formsetOptions.hideAddFormButtonOnMaxForms) {
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

        // Update visibility of the `addFormButton`
        if (formsetOptions.hideAddFormButtonOnMaxForms) {
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
         * Undefined option values in `defaultOptions` are required. Failing to
         * specify them in `customOptions` will throw an error.
         */
        const missingOptions = [];

        customOptions = customOptions || {};
        for (let optionKey in defaultOptions) {  // eslint-disable-line prefer-const -- using `let` for IE11
            // Attempt to retrieve option values from `customOptions`, falling
            // back to values from `defaultOptions`
            let optionValue;
            if (Object.prototype.hasOwnProperty.call(customOptions, optionKey)) {
                optionValue = customOptions[optionKey];
            }
            else {
                optionValue = defaultOptions[optionKey];
            }

            // Store missing required options in `missingOptions`
            const required = (typeof defaultOptions[optionKey] === 'undefined');
            if (required && typeof optionValue === 'undefined') {
                missingOptions.push(optionKey);
            }
            else {
                formsetOptions[optionKey] = optionValue;
            }
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

        // Throw error if DOM elements are missing
        if (missingElements.length) {
            const formattedMissingElements = missingElements.map(
                function(item) { return '`' + item + '`'; }
            ).join(', ');
            const message = (
                'Unable to find DOM element with selectors: ' +
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
        formsetElements.addFormButton.addEventListener(
            'click', addFormButtonClicked
        );

        const forms = formsetElements.formsContainer.querySelectorAll(
            formsetOptions.formSelector + ':not([hidden])'
        );
        if (forms.length && formsetOptions.deleteFormButtonSelector !== null) {
            for (let i = 0; i < forms.length; i++) {
                const form = forms[i];
                const deleteFormButton = form.querySelector(
                        formsetOptions.deleteFormButtonSelector);
                if (deleteFormButton !== null) {
                    deleteFormButton.addEventListener(
                        'click', deleteFormButtonClicked.bind(this, form)
                    );
                }
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

        if (formsetOptions.deleteFormButtonSelector !== null) {
            hideFormsMarkedForDeletion();
        }

        if (formsetOptions.hideAddFormButtonOnMaxForms) {
            updateAddFormButtonVisibility();
        }

        initializeEventListeners();
    })(options);
};
