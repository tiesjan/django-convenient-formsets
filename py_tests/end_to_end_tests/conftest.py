import pytest


@pytest.fixture(scope='function')
def capabilities(capabilities, request):
    # Set name for TestingBot test run
    capabilities['name'] = '::'.join([
        request.node.parent.name,
        request.node.name
    ])
    return capabilities


@pytest.fixture(scope='session')
def is_legacy_edge():
    def test_capabilities_for_legacy_edge(capabilities):
        browser_name = capabilities.get('browserName', '')
        browser_version = capabilities.get('browserVersion', '')
        try:
            browser_version = int(browser_version.partition('.')[0])
        except ValueError:
            browser_version = 79
        return 'edge' in browser_name.lower() and browser_version < 79
    return test_capabilities_for_legacy_edge
