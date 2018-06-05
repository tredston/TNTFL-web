import unittest

import requests
from flask import Flask
from requests.auth import HTTPBasicAuth
from urllib.parse import urljoin

from tntfl.blueprints.game_api import game_api
from tntfl.constants import config
from tntfl.test.blueprints.test_case import TestCase


@unittest.skip('Credentials required')
class TestDelete(unittest.TestCase):
    username = ''
    password = ''

    def setUp(self):
        self.setUpClass()

    def tearDown(self):
        self.tearDownClass()

    def test(self):
        url = urljoin(config.ladder_host, 'game/1430928939/delete')
        response = requests.post(url, auth=HTTPBasicAuth(self.username, self.password))
        print(response.text)
        self.assertEqual(response.status_code, 204)

    def testUnauthenticated(self):
        url = urljoin(config.ladder_host, 'game/1430928939/delete')
        response = requests.post(url)
        self.assertEqual(response.status_code, 401)

    def testRedirect(self):
        redirect = 'https://www.google.com'
        url = urljoin(config.ladder_host, 'game/1430928939/delete')
        query = {
            'redirect': redirect
        }
        response = requests.post(url, params=query, auth=HTTPBasicAuth(self.username, self.password), allow_redirects=False)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['Location'], redirect)


class ApiTests(TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(game_api)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()


class DeletePage(ApiTests):
    @unittest.skip('TODO')
    def testReferrer(self):
        # TODO send referrer info
        r = self.client.post(self._page('/game/1223308996/delete/json'))
        self.assertEqual(r.status_code, 302)
