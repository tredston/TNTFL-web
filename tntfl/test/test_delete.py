import unittest
from urllib.parse import urljoin

import requests
from requests.auth import HTTPBasicAuth

from tntfl.constants import ladder_host
from tntfl.test.functional_test_base import FunctionalTestBase


@unittest.skip('Credentials required')
class TestDelete(FunctionalTestBase):
    username = ''
    password = ''

    def setUp(self):
        self.setUpClass()

    def tearDown(self):
        self.tearDownClass()

    def test(self):
        url = urljoin(ladder_host, 'game/1430928939/delete')
        response = requests.post(url, auth=HTTPBasicAuth(self.username, self.password))
        print(response.text)
        self.assertEqual(response.status_code, 204)

    def testUnauthenticated(self):
        url = urljoin(ladder_host, 'game/1430928939/delete')
        response = requests.post(url)
        self.assertEqual(response.status_code, 401)

    def testRedirect(self):
        redirect = 'https://www.google.com'
        url = urljoin(ladder_host, 'game/1430928939/delete')
        query = {
            'redirect': redirect
        }
        response = requests.post(url, params=query, auth=HTTPBasicAuth(self.username, self.password), allow_redirects=False)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['Location'], redirect)
