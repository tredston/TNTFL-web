from urllib.parse import urljoin

import requests

from tntfl.constants import config
from tntfl.test.functional_test_base import FunctionalTestBase


class TestAdd(FunctionalTestBase):
    def test(self):
        url = urljoin(config.ladder_host, 'game/add')
        query = {
            'redPlayer': 'foo',
            'redScore': 4,
            'bluePlayer': 'bar',
            'blueScore': 6,
        }
        response = requests.post(url, params=query)
        self.assertEqual(response.status_code, 204)

    def testMissingParams(self):
        url = urljoin(config.ladder_host, 'game/add')
        query = {
            'redPlayer': 'foo',
            'redScore': 4,
        }
        response = requests.post(url, params=query)
        self.assertEqual(response.status_code, 400)

    def testPlayingSelf(self):
        url = urljoin(config.ladder_host, 'game/add')
        query = {
            'redPlayer': 'foo',
            'redScore': 4,
            'bluePlayer': 'foo',
            'blueScore': 6,
        }
        response = requests.post(url, params=query)
        self.assertEqual(response.status_code, 400)

    def testNegativeGoals(self):
        url = urljoin(config.ladder_host, 'game/add')
        query = {
            'redPlayer': 'foo',
            'redScore': -4,
            'bluePlayer': 'bar',
            'blueScore': 6,
        }
        response = requests.post(url, params=query)
        self.assertEqual(response.status_code, 400)
