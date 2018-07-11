import json

import requests
from flask import Flask
from urllib.parse import urljoin

from tntfl.blueprints.game_api import game_api
from tntfl.constants import config
from tntfl.test.blueprints.test_case import TestCase
from tntfl.test.integration_test_base import IntegrationTestBase


class TestAdd(IntegrationTestBase):
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


class ApiTests(TestCase, IntegrationTestBase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(game_api)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()


class AddGame(ApiTests):
    def test(self):
        page = '/game/add/json'
        query = 'redPlayer=foo&redScore=5&bluePlayer=bar&blueScore=5'
        r = self.client.post(self._page(page, query))
        self.assertEqual(r.status_code, 200)
        newGame = json.loads(r.data.decode('utf-8'))
        self.assertEqual(newGame['red']['name'], 'foo')

    def testAddYellowStripe(self):
        page = '/game/add/json'
        query = 'redPlayer=foo&redScore=10&bluePlayer=bar&blueScore=0'
        r = self.client.post(self._page(page, query))
        self.assertEqual(r.status_code, 200)
        newGame = json.loads(r.data.decode('utf-8'))
        self.assertEqual(newGame['red']['name'], 'foo')
