import json

from flask import Flask

from tntfl.blueprints.game_api import game_api
from tntfl.test.blueprints.test_case import TestCase
from tntfl.test.integration_test_base import IntegrationTestBase


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
