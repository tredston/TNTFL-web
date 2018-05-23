from flask import Flask

from tntfl.blueprints.ladder_api import ladder_api
from tntfl.test.blueprints.test_case import TestCase


class ApiTests(TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(ladder_api)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()


class LadderApi(ApiTests):
    def test(self):
        response = self._getJson('/ladder/json')
        self.assertEqual(len(response), 0)

    def testLadderRange(self):
        response = self._getJson('/ladder/1223308996/1223400000/json')
        self.assertEqual(len(response), 3)

    def testRange(self):
        response = self._getJson('/ladder/json', 'gamesFrom=1223308996&gamesTo=1223400000')
        self.assertEqual(len(response), 3)
        self.assertEqual(response[0]['rank'], 1)
        self.assertEqual(response[0]['name'], 'jrem')
        self.assertAlmostEqual(response[0]['skill'], 16.50273, 4)
        self.assertEqual(response[2]['rank'], 3)
        self.assertEqual(response[2]['name'], 'kjb')
        self.assertEqual(response[2]['skill'], -12.5)

    def testInactive(self):
        response = self._getJson('/ladder/json', 'showInactive=1')
        self.assertEqual(len(response), 33)

    def testPlayers(self):
        response = self._getJson('/ladder/json', 'showInactive=1&players=1')
        self.assertEqual(len(response), 33)
        self.assertTrue('player' in response[0])
        self.assertTrue('trend' in response[0])
        self.assertEqual(len(response[0]['trend']), 10)
