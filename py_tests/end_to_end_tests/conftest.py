import json

import pytest
from pytest_selenium.drivers.browserstack import BrowserStack


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    # Execute all other hooks to obtain the report object
    outcome = yield
    rep = outcome.get_result()

    # Store report for each phase of a test: "setup", "call" and "teardown"
    setattr(item, f'test_report_{rep.when}', rep)


@pytest.fixture(scope='function')
def selenium(selenium, request):
    # Execute test
    yield selenium

    # Report to BrowserStack whether or not the test has passed
    provider = BrowserStack()
    if provider.uses_driver(request.node.config.getoption('driver')):
        if request.node.test_report_setup.failed:
            status = 'failed'
            reason = 'Setting up test failed.'
        elif request.node.test_report_call.failed:
            status = 'failed'
            reason = 'Executing test failed.'
        else:
            status = 'passed'
            reason = 'OK'

        cmd = {
            "action": "setSessionStatus",
            "arguments": {"status": status, "reason": reason}
        }
        selenium.execute_script(f'browserstack_executor: {json.dumps(cmd)}')
