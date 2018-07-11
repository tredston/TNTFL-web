from flask import Flask

from tntfl.blueprints.common import tntfl
from tntfl.blueprints.player_api import player_api
from tntfl.test.blueprints.test_case import TestCase
from tntfl.test.configured_test_case import ConfiguredTestCase


class ApiTests(TestCase, ConfiguredTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        tntfl.invalidate()

    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(player_api)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()


class PlayerApi(ApiTests):
    def testNoPlayer(self):
        r = self.client.get(self._page('/player/'))
        self.assertEqual(r.status_code, 404)

    def testInvalidPlayer(self):
        r = self.client.get(self._page('/player/missing/json'))
        self.assertEqual(r.status_code, 404)

    def testPlayerJson(self):
        response = self._getJson('/player/rc/json')
        self.assertEqual(response['name'], "rc")
        self.assertEqual(response['rank'], -1)
        self.assertEqual(response['activity'], 0)
        self.assertAlmostEqual(response['skill'], 1.55744, 4)
        self.assertEqual(response['total']['for'], 59)
        self.assertEqual(response['total']['against'], 142)
        self.assertEqual(response['total']['games'], 20)
        self.assertEqual(response['total']['gamesAsRed'], 15)
        self.assertEqual(response['total']['wins'], 2)
        self.assertEqual(response['total']['losses'], 16)
        self.assertEqual(response['total']['gamesToday'], 0)

    def testPlayerGamesJson(self):
        response = self._getJson('/player/rc/games/json')
        self.assertEqual(len(response), 20)
        self.assertEqual(response[0]['date'], 1278339173)

    def testPerPlayerStatsJson(self):
        response = self._getJson('/player/rc/perplayerstats/json')
        self.assertEqual(len(response), 1)
        jrem = response[0]
        self.assertEqual(jrem['opponent'], 'jrem')
        self.assertEqual(jrem['games'], 20)
        self.assertEqual(jrem['wins'], 2)
        self.assertEqual(jrem['losses'], 16)
        self.assertEqual(jrem['for'], 59)
        self.assertEqual(jrem['against'], 142)
        self.assertAlmostEqual(jrem['skillChange'], 1.55744, 4)

    def testAchievements(self):
        response = self._getJson('/player/rc/achievements/json')
        self.assertEqual(len(response), 25)
        self.assertEqual(len([a for a in response if 'time' in a]), 5)
        self.assertIn('name', response[0])
        self.assertIn('description', response[0])
        self.assertIn('time', response[0])
