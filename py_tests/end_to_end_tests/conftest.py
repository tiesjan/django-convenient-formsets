import pytest


@pytest.fixture(scope="function")
def capabilities(capabilities, request):
    # Set name for TestingBot test run
    capabilities["name"] = "::".join([request.node.parent.name, request.node.name])
    return capabilities
