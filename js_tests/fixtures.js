const jsdom = require('jsdom');


exports.JSDOMContext = function() {
    this.console = {
        'messages': {
            'error': Array()
        }
    };

    // Helper function to generate DOM; optionally including `htmlTemplate`
    this.generateDOM = function(htmlTemplate) {
        // Set up virtual console
        const onErrorMessage = function(...output) {
            this.console.messages.error.push(...output);
        };
        const virtualConsole = new jsdom.VirtualConsole();
        virtualConsole.on('error', onErrorMessage.bind(this));

        return new Promise(function(resolve) {
            const dom = new jsdom.JSDOM(`
                <!doctype html>
                <html>
                    <body>
                        ${htmlTemplate || ''}
                        <script src="convenient_formsets/convenient_formsets.js"></script>
                    </body>
                </html>
                `,
                {
                    'virtualConsole': virtualConsole,
                    'url': 'file://' + __dirname + '/../convenient_formsets/static/',
                    'contentType': 'text/html',
                    'resources': 'usable',
                    'runScripts': 'dangerously'
                }
            );
            dom.window.addEventListener('load', function() { resolve(dom); });
        });
    };

    return this;
};
