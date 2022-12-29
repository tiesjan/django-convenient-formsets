const {JSDOMContext} = require('./fixtures');
const tap = require('tap');


tap.beforeEach(function(done, tap) {
    tap.context = new JSDOMContext();
    done();
});


tap.test(
    'Adding form with 2 visible forms of 2 initial forms',
    function(tap) {
        // Note: input elements have both `id` and `name` attributes
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container">
                    <form class="form">
                        <input type="text" id="id_formset-0-user" name="formset-0-user" value="user0">
                        <input type="hidden" id="id_formset-0-user" name="formset-0-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" id="id_formset-1-user" name="formset-1-user" value="user1">
                        <input type="hidden" id="id_formset-1-user" name="formset-1-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <input type="text" id="id_formset-__prefix__-user" name="formset-__prefix__-user">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="management-form">
                    <input type="hidden" name="formset-TOTAL_FORMS" value="2">
                    <input type="hidden" name="formset-INITIAL_FORMS" value="2">
                    <input type="hidden" name="formset-MIN_NUM_FORMS" value="0">
                    <input type="hidden" name="formset-MAX_NUM_FORMS" value="5">
                </div>
            </div>
        `;

        tap.context.generateDOM(htmlTemplate).then(function(dom) {
            // Initialization
            dom.window.eval(`
                ConvenientFormset({
                    'formsetPrefix': 'formset',
                    'formsContainerSelector': '#formset #forms-container',
                    'formSelector': '.form',
                    'emptyFormSelector': '#formset #empty-form .form',
                    'addFormButtonSelector': '#formset #add-form-button',
                    'deleteFormButtonSelector': '#delete-form-button',
                });
            `);

            // Initiate click on `addFormButton`
            const document = dom.window.document;
            const addFormButton = document.querySelector('#add-form-button');
            addFormButton.click();

            // Assertions
            tap.equals(tap.context.console.messages.error.length, 0);

            const forms = document.querySelectorAll(
                '#formset #forms-container .form'
            );
            tap.equals(forms.length, 3);
            const expectedValues = ['user0', 'user1', ''];
            for (let i = 0; i < forms.length; i++) {
                // Text input
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].id,
                    `id_formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].name,
                    `formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].value,
                    expectedValues[i]
                );
            }

            const totalFormsInput = document.querySelector(
                'input[name="formset-TOTAL_FORMS"]'
            );
            tap.equals(parseInt(totalFormsInput.value, 10), 3);
            const initialFormsInput = document.querySelector(
                'input[name="formset-INITIAL_FORMS"]'
            );
            tap.equals(parseInt(initialFormsInput.value, 10), 2);
            const minNumFormsInput = document.querySelector(
                'input[name="formset-MIN_NUM_FORMS"]'
            );
            tap.equals(parseInt(minNumFormsInput.value, 10), 0);
            const maxNumFormsInput = document.querySelector(
                'input[name="formset-MAX_NUM_FORMS"]'
            );
            tap.equals(parseInt(maxNumFormsInput.value, 10), 5);

            tap.equals(document.querySelector('#add-form-button').hidden, false);

            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Adding form with 2 visible forms of 5 initial forms',
    function(tap) {
        // Note: input elements have `name` attribute only
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container">
                    <form class="form">
                        <input type="text" name="formset-0-user" value="user0">
                        <input type="hidden" name="formset-0-DELETE" value="on">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-1-user" value="user1">
                        <input type="hidden" name="formset-1-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-2-user" value="user2">
                        <input type="hidden" name="formset-2-DELETE" value="on">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-3-user" value="user3">
                        <input type="hidden" name="formset-3-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-4-user" value="user4">
                        <input type="hidden" name="formset-4-DELETE" value="on">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <input type="text" name="formset-__prefix__-user">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="management-form">
                    <input type="hidden" name="formset-TOTAL_FORMS" value="5">
                    <input type="hidden" name="formset-INITIAL_FORMS" value="5">
                    <input type="hidden" name="formset-MIN_NUM_FORMS" value="0">
                    <input type="hidden" name="formset-MAX_NUM_FORMS" value="5">
                </div>
            </div>
        `;

        tap.context.generateDOM(htmlTemplate).then(function(dom) {
            // Initialization
            dom.window.eval(`
                ConvenientFormset({
                    'formsetPrefix': 'formset',
                    'formsContainerSelector': '#formset #forms-container',
                    'formSelector': '.form',
                    'emptyFormSelector': '#formset #empty-form .form',
                    'addFormButtonSelector': '#formset #add-form-button',
                    'deleteFormButtonSelector': '#delete-form-button',
                });
            `);

            // Initiate click on `addFormButton`
            const document = dom.window.document;
            const addFormButton = document.querySelector('#add-form-button');
            addFormButton.click();

            // Assertions
            tap.equals(tap.context.console.messages.error.length, 0);

            const forms = document.querySelectorAll(
                '#formset #forms-container .form'
            );
            tap.equals(forms.length, 6);
            const expectedValues = ['user0', 'user1', 'user2', 'user3', 'user4', ''];
            for (let i = 0; i < forms.length; i++) {
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].name,
                    `formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].value,
                    expectedValues[i]
                );
            }

            const totalFormsInput = document.querySelector(
                'input[name="formset-TOTAL_FORMS"]'
            );
            tap.equals(parseInt(totalFormsInput.value, 10), 6);
            const initialFormsInput = document.querySelector(
                'input[name="formset-INITIAL_FORMS"]'
            );
            tap.equals(parseInt(initialFormsInput.value, 10), 5);
            const minNumFormsInput = document.querySelector(
                'input[name="formset-MIN_NUM_FORMS"]'
            );
            tap.equals(parseInt(minNumFormsInput.value, 10), 0);
            const maxNumFormsInput = document.querySelector(
                'input[name="formset-MAX_NUM_FORMS"]'
            );
            tap.equals(parseInt(maxNumFormsInput.value, 10), 5);

            tap.equals(document.querySelector('#add-form-button').hidden, false);

            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Adding form with 5 visible forms of 5 initial forms',
    function(tap) {
        // Note: input elements have `id` attribute only & forms cannot be deleted
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container">
                    <form class="form">
                        <input type="text" id="id_formset-0-user" value="user0">
                    </form>
                    <form class="form">
                        <input type="text" id="id_formset-1-user" value="user1">
                    </form>
                    <form class="form">
                        <input type="text" id="id_formset-2-user" value="user2">
                    </form>
                    <form class="form">
                        <input type="text" id="id_formset-3-user" value="user3">
                    </form>
                    <form class="form">
                        <input type="text" id="id_formset-4-user" value="user4">
                    </form>
                </div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <input type="text" id="id_formset-__prefix__-user">
                    </form>
                </div>
                <div id="management-form">
                    <input type="hidden" name="formset-TOTAL_FORMS" value="5">
                    <input type="hidden" name="formset-INITIAL_FORMS" value="5">
                    <input type="hidden" name="formset-MIN_NUM_FORMS" value="0">
                    <input type="hidden" name="formset-MAX_NUM_FORMS" value="5">
                </div>
            </div>
        `;

        tap.context.generateDOM(htmlTemplate).then(function(dom) {
            // Initialization
            dom.window.eval(`
                ConvenientFormset({
                    'formsetPrefix': 'formset',
                    'formsContainerSelector': '#formset #forms-container',
                    'formSelector': '.form',
                    'emptyFormSelector': '#formset #empty-form .form',
                    'addFormButtonSelector': '#formset #add-form-button',
                });
            `);

            // Initiate click on `addFormButton`
            const document = dom.window.document;
            const addFormButton = document.querySelector('#add-form-button');
            addFormButton.click();

            // Assertions
            tap.equals(tap.context.console.messages.error.length, 0);

            const forms = document.querySelectorAll(
                '#formset #forms-container .form'
            );
            tap.equals(forms.length, 5);
            const expectedValues = ['user0', 'user1', 'user2', 'user3', 'user4'];
            for (let i = 0; i < forms.length; i++) {
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].id,
                    `id_formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].value,
                    expectedValues[i]
                );
            }

            const totalFormsInput = document.querySelector(
                'input[name="formset-TOTAL_FORMS"]'
            );
            tap.equals(parseInt(totalFormsInput.value, 10), 5);
            const initialFormsInput = document.querySelector(
                'input[name="formset-INITIAL_FORMS"]'
            );
            tap.equals(parseInt(initialFormsInput.value, 10), 5);
            const minNumFormsInput = document.querySelector(
                'input[name="formset-MIN_NUM_FORMS"]'
            );
            tap.equals(parseInt(minNumFormsInput.value, 10), 0);
            const maxNumFormsInput = document.querySelector(
                'input[name="formset-MAX_NUM_FORMS"]'
            );
            tap.equals(parseInt(maxNumFormsInput.value, 10), 5);

            tap.equals(document.querySelector('#add-form-button').hidden, true);

            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Adding form with 4 visible forms of 4 initial forms',
    function(tap) {
        // Note: input elements have `id` attribute only & corresponding label
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container">
                    <form class="form">
                        <label for="id_formset-0-user">Username:</label>
                        <input type="text" id="id_formset-0-user" value="user0">
                        <input type="hidden" id="id_formset-0-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <label for="id_formset-1-user">Username:</label>
                        <input type="text" id="id_formset-1-user" value="user1">
                        <input type="hidden" id="id_formset-1-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <label for="id_formset-2-user">Username:</label>
                        <input type="text" id="id_formset-2-user" value="user2">
                        <input type="hidden" id="id_formset-2-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <label for="id_formset-3-user">Username:</label>
                        <input type="text" id="id_formset-3-user" value="user3">
                        <input type="hidden" id="id_formset-3-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <label for="id_formset-__prefix__-user">Username:</label>
                        <input type="text" id="id_formset-__prefix__-user">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="management-form">
                    <input type="hidden" name="formset-TOTAL_FORMS" value="4">
                    <input type="hidden" name="formset-INITIAL_FORMS" value="4">
                    <input type="hidden" name="formset-MIN_NUM_FORMS" value="0">
                    <input type="hidden" name="formset-MAX_NUM_FORMS" value="5">
                </div>
            </div>
        `;

        tap.context.generateDOM(htmlTemplate).then(function(dom) {
            // Initialization
            dom.window.eval(`
                ConvenientFormset({
                    'formsetPrefix': 'formset',
                    'formsContainerSelector': '#formset #forms-container',
                    'formSelector': '.form',
                    'emptyFormSelector': '#formset #empty-form .form',
                    'addFormButtonSelector': '#formset #add-form-button',
                    'deleteFormButtonSelector': '#delete-form-button',
                });
            `);

            // Initiate click on `addFormButton`
            const document = dom.window.document;
            const addFormButton = document.querySelector('#add-form-button');
            addFormButton.click();

            // Assertions
            tap.equals(tap.context.console.messages.error.length, 0);

            const forms = document.querySelectorAll(
                '#formset #forms-container .form'
            );
            tap.equals(forms.length, 5);
            const expectedValues = ['user0', 'user1', 'user2', 'user3', ''];
            for (let i = 0; i < forms.length; i++) {
                tap.equals(
                    forms[i].querySelectorAll('label')[0].getAttribute('for'),
                    `id_formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].id,
                    `id_formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].value,
                    expectedValues[i]
                );
            }

            const totalFormsInput = document.querySelector(
                'input[name="formset-TOTAL_FORMS"]'
            );
            tap.equals(parseInt(totalFormsInput.value, 10), 5);
            const initialFormsInput = document.querySelector(
                'input[name="formset-INITIAL_FORMS"]'
            );
            tap.equals(parseInt(initialFormsInput.value, 10), 4);
            const minNumFormsInput = document.querySelector(
                'input[name="formset-MIN_NUM_FORMS"]'
            );
            tap.equals(parseInt(minNumFormsInput.value, 10), 0);
            const maxNumFormsInput = document.querySelector(
                'input[name="formset-MAX_NUM_FORMS"]'
            );

            tap.equals(parseInt(maxNumFormsInput.value, 10), 5);

            tap.equals(document.querySelector('#add-form-button').hidden, true);

            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Deleting the 2nd and 3rd of 5 forms in total (2 initial and 3 new)',
    function(tap) {
        // Note: input elements have `name` attribute only
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container">
                    <!-- Forms including DELETE inputs -->
                    <form class="form">
                        <input type="text" name="formset-0-user" value="user0">
                        <input type="hidden" name="formset-0-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-1-user" value="user1">
                        <input type="hidden" name="formset-1-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <!-- Forms excluding DELETE inputs -->
                    <form class="form">
                        <input type="text" name="formset-2-user" value="user2">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-3-user" value="user3">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-4-user" value="user4">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <input type="text" name="formset-__prefix__-user">
                        <input type="button" id="delete-form-button">
                    </form>
                </div>
                <div id="management-form">
                    <input type="hidden" name="formset-TOTAL_FORMS" value="5">
                    <input type="hidden" name="formset-INITIAL_FORMS" value="2">
                    <input type="hidden" name="formset-MIN_NUM_FORMS" value="0">
                    <input type="hidden" name="formset-MAX_NUM_FORMS" value="5">
                </div>
            </div>
        `;

        tap.context.generateDOM(htmlTemplate).then(function(dom) {
            let forms;

            // Initialization
            dom.window.eval(`
                ConvenientFormset({
                    'formsetPrefix': 'formset',
                    'formsContainerSelector': '#formset #forms-container',
                    'formSelector': '.form',
                    'emptyFormSelector': '#formset #empty-form .form',
                    'addFormButtonSelector': '#formset #add-form-button',
                    'deleteFormButtonSelector': '#delete-form-button',
                });
            `);

            // Initiate click on `addFormButton`
            const document = dom.window.document;
            forms = document.querySelectorAll(
                '#formset #forms-container .form'
            );
            forms[1].querySelector('#delete-form-button').click();
            forms[2].querySelector('#delete-form-button').click();

            // Assertions
            tap.equals(tap.context.console.messages.error.length, 0);

            forms = document.querySelectorAll(
                '#formset #forms-container .form'
            );
            tap.equals(forms.length, 4);
            const expectedValues = ['user0', 'user1', 'user3', 'user4'];
            for (let i = 0; i < forms.length; i++) {
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].name,
                    `formset-${i}-user`
                );
                tap.equals(
                    forms[i].querySelectorAll('input[type="text"]')[0].value,
                    expectedValues[i]
                );
            }

            const totalFormsInput = document.querySelector(
                'input[name="formset-TOTAL_FORMS"]'
            );
            tap.equals(parseInt(totalFormsInput.value, 10), 4);
            const initialFormsInput = document.querySelector(
                'input[name="formset-INITIAL_FORMS"]'
            );
            tap.equals(parseInt(initialFormsInput.value, 10), 2);
            const minNumFormsInput = document.querySelector(
                'input[name="formset-MIN_NUM_FORMS"]'
            );
            tap.equals(parseInt(minNumFormsInput.value, 10), 0);
            const maxNumFormsInput = document.querySelector(
                'input[name="formset-MAX_NUM_FORMS"]'
            );
            tap.equals(parseInt(maxNumFormsInput.value, 10), 5);

            tap.equals(document.querySelector('#add-form-button').hidden, false);

            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);
