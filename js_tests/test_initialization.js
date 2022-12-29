const {JSDOMContext} = require('./fixtures');
const tap = require('tap');


tap.beforeEach(function(done, tap) {
    tap.context = new JSDOMContext();
    done();
});


tap.test(
    'Initialization failure: no options given to constructor',
    function(tap) {
        const htmlTemplate = null;
        tap.context.generateDOM(htmlTemplate).then(function(dom) {
            // Initialization
            dom.window.eval('ConvenientFormset({});');

            // Assertions
            const messages = tap.context.console.messages.error;
            tap.equals(messages.length, 2);
            tap.equals(messages[0], '[ConvenientFormset]');
            tap.equals(
                messages[1],
                'Missing required options: `formsetPrefix`, ' +
                '`formsContainerSelector`, `formSelector`, ' +
                '`emptyFormSelector`, `addFormButtonSelector`'
            );
            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Initialization failure: formset elements not found',
    function(tap) {
        const htmlTemplate = null;
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

            // Assertions
            const messages = tap.context.console.messages.error;
            tap.equals(messages.length, 2);
            tap.equals(messages[0], '[ConvenientFormset]');
            tap.equals(
                messages[1],
                'Unable to find DOM element with selectors: ' +
                '`#formset #forms-container`, `#formset #empty-form .form`, ' +
                '`#formset #add-form-button`'
            );
            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Initialization failure: management form not found',
    function(tap) {
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container"></div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <input type="text" name="formset-0-user" value="user0">
                        <input type="hidden" name="formset-0-DELETE">
                    </form>
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

            // Assertions
            const messages = tap.context.console.messages.error;
            tap.equals(messages.length, 2);
            tap.equals(messages[0], '[ConvenientFormset]');
            tap.equals(
                messages[1],
                'Management form for formset with prefix `formset` missing ' +
                'or has been tampered with.'
            );
            tap.end();
        }).catch(function(error) {
            console.error(error);
            tap.fail('Error running test.');
            tap.end();
        });
    }
);


tap.test(
    'Initialization: hiding forms marked for deletion',
    function(tap) {
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
                </div>
                <div id="add-form-button"></div>
                <div id="empty-form">
                    <form class="form">
                        <input type="text" name="formset-__prefix__-user">
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

        tap.test(
            'With `deleteFormButtonSelector` specified: 1st form should be hidden',
            function(tap) {
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

                    // Assertions
                    tap.equals(tap.context.console.messages.error.length, 0);
                    const document = dom.window.document;
                    const forms = document.querySelectorAll(
                        '#formset #forms-container .form'
                    );
                    tap.equals(forms[0].hidden, true);
                    tap.equals(forms[1].hidden, false);
                    tap.end();
                }).catch(function(error) {
                    console.error(error);
                    tap.fail('Error running test.');
                    tap.end();
                });
            }
        );

        tap.test(
            'With `deleteFormButtonSelector` omitted: should not hide any form',
            function(tap) {
                tap.context.generateDOM(htmlTemplate).then(function(dom) {
                    // Initialization
                    dom.window.eval(`
                        ConvenientFormset({
                            'formsetPrefix': 'formset',
                            'formsContainerSelector': '#formset #forms-container',
                            'formSelector': '.form',
                            'emptyFormSelector': '#formset #empty-form .form',
                            'addFormButtonSelector': '#formset #add-form-button',
                            // 'deleteFormButtonSelector' omitted
                        });
                    `);

                    // Assertions
                    tap.equals(tap.context.console.messages.error.length, 0);
                    const document = dom.window.document;
                    const forms = document.querySelectorAll(
                        '#formset #forms-container .form'
                    );
                    tap.equals(forms[0].hidden, false);
                    tap.equals(forms[1].hidden, false);
                    tap.end();
                }).catch(function(error) {
                    console.error(error);
                    tap.fail('Error running test.');
                    tap.end();
                });
            }
        );

        tap.end();
    }
);


tap.test(
    'Initialization: hiding add form button when max forms are reached',
    function(tap) {
        const htmlTemplate = `
            <div id="formset">
                <div id="forms-container">
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
                    <form class="form">
                        <input type="text" name="formset-2-user" value="user2">
                        <input type="hidden" name="formset-2-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-3-user" value="user3">
                        <input type="hidden" name="formset-3-DELETE">
                        <input type="button" id="delete-form-button">
                    </form>
                    <form class="form">
                        <input type="text" name="formset-4-user" value="user4">
                        <input type="hidden" name="formset-4-DELETE">
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
                    <input type="hidden" name="formset-TOTAL_FORMS" value="2">
                    <input type="hidden" name="formset-INITIAL_FORMS" value="2">
                    <input type="hidden" name="formset-MIN_NUM_FORMS" value="0">
                    <input type="hidden" name="formset-MAX_NUM_FORMS" value="5">
                </div>
            </div>
        `;

        tap.test(
            '`hideAddFormButtonOnMaxForms` set to true: should hide add form button',
            function(tap) {
                tap.context.generateDOM(htmlTemplate).then(function(dom) {
                    // Initialization
                    dom.window.eval(`
                        ConvenientFormset({
                            'formsetPrefix': 'formset',
                            'formsContainerSelector': '#formset #forms-container',
                            'formSelector': '.form',
                            'emptyFormSelector': '#formset #empty-form .form',
                            'addFormButtonSelector': '#formset #add-form-button',
                            'hideAddFormButtonOnMaxForms': true,
                        });
                    `);

                    // Assertions
                    tap.equals(tap.context.console.messages.error.length, 0);
                    const document = dom.window.document;
                    tap.equals(
                        document.querySelector('#add-form-button').hidden,
                        true
                    );
                    tap.end();
                }).catch(function(error) {
                    console.error(error);
                    tap.fail('Error running test.');
                    tap.end();
                });
            }
        );

        tap.test(
            '`hideAddFormButtonOnMaxForms` set to true: should not hide add form button',
            function(tap) {
                tap.context.generateDOM(htmlTemplate).then(function(dom) {
                    // Initialization
                    dom.window.eval(`
                        ConvenientFormset({
                            'formsetPrefix': 'formset',
                            'formsContainerSelector': '#formset #forms-container',
                            'formSelector': '.form',
                            'emptyFormSelector': '#formset #empty-form .form',
                            'addFormButtonSelector': '#formset #add-form-button',
                            'hideAddFormButtonOnMaxForms': false,
                        });
                    `);

                    // Assertions
                    tap.equals(tap.context.console.messages.error.length, 0);
                    const document = dom.window.document;
                    tap.equals(
                        document.querySelector('#add-form-button').hidden,
                        false
                    );
                    tap.end();
                }).catch(function(error) {
                    console.error(error);
                    tap.fail('Error running test.');
                    tap.end();
                });
            }
        );

        tap.end();
    }
);
