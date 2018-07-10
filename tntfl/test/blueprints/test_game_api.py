from flask import Flask

from tntfl.blueprints.common import tntfl
from tntfl.blueprints.game_api import game_api
from tntfl.test.blueprints.test_case import TestCase
from tntfl.test.configured_test_case import ConfiguredTestCase


class ApiTests(TestCase, ConfiguredTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        tntfl.invalidate()

    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(game_api)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()


class AddGame(ApiTests):
    def testNoSinglePlayer(self):
        page = '/game/add/json'
        query = 'redPlayer=cxh&redScore=10&bluePlayer=cxh&blueScore=0'
        r = self.client.post(self._page(page, query))
        self.assertEqual(r.status_code, 400)

    def testInvalidAdd(self):
        r = self.client.post(self._page('/game/add/json'))
        self.assertEqual(r.status_code, 400)


class GameApi(ApiTests):
    def testNoGame(self):
        r = self.client.get(self._page('/game/'))
        self.assertEqual(r.status_code, 404)

    def testInvalidGame(self):
        r = self.client.get(self._page('/game/123/json'))
        self.assertEqual(r.status_code, 404)

    def test(self):
        response = self._getJson('/game/1223308996/json')
        self.assertEqual(response['red']['name'], 'jrem')
        self.assertEqual(response['red']['href'], '../../player/jrem/json')
        self.assertEqual(response['red']['score'], 10)
        self.assertAlmostEqual(response['red']['skillChange'], 13.00655, 4)
        self.assertEqual(response['red']['rankChange'], 1)
        self.assertEqual(response['red']['newRank'], 3)
        self.assertListEqual(sorted(response['red']['achievements'], key=lambda x: x['name']), [{
            'name': 'Flawless Victory',
            'description': 'Beat an opponent 10-0',
        }, {
            'name': 'PokeMaster',
            'description': 'Collect all the scores',
        }])

        self.assertEqual(response['blue']['name'], 'kjb')
        self.assertEqual(response['blue']['href'], '../../player/kjb/json')
        self.assertEqual(response['blue']['score'], 0)
        self.assertAlmostEqual(response['blue']['skillChange'], -13.00655, 4)
        self.assertEqual(response['blue']['rankChange'], -2)
        self.assertEqual(response['blue']['newRank'], 5)
        self.assertListEqual(sorted(response['blue']['achievements'], key=lambda x: x['name']), [{
            'name': 'The Worst',
            'description': 'Go last in the rankings',
        }])

        self.assertEqual(response['positionSwap'], True)
        self.assertEqual(response['date'], 1223308996)

    def testDeleted(self):
        response = self._getJson('/game/1430915499/json')
        self.assertTrue('deleted' in response)
        self.assertEqual(response['deleted']['by'], 'eu')
        self.assertEqual(response['deleted']['at'], 1430915500)
