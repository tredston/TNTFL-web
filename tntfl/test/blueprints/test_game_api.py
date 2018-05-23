import unittest
import urllib.error
import urllib.parse
import urllib.request

from flask import Flask

from tntfl.blueprints.game_api import game_api
from tntfl.test.blueprints.test_case import TestCase


class ApiTests(TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(game_api)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()


@unittest.skip('No add')
class AddGame(ApiTests):
    def test(self):
        page = 'game/add/json'
        query = 'redPlayer=foo&redScore=5&bluePlayer=bar&blueScore=5'
        newGame = self._getJson(page, query)
        self.assertEqual(newGame['red']['name'], 'foo')

    def testAddYellowStripeApi(self):
        page = 'game/add/json'
        query = 'redPlayer=foo&redScore=10&bluePlayer=bar&blueScore=0'
        r = self.client.post(self._page(page, query)).json()
        self.assertEqual(r['red']['name'], 'foo')

    def testNoSinglePlayer(self):
        page = 'game/add/json'
        query = 'redPlayer=cxh&redScore=10&bluePlayer=cxh&blueScore=0'
        r = self.client.post(self._page(page, query))
        self.assertEqual(r.status_code, 400)

    def testInvalidAdd(self):
        r = self.client.get(self._page('game/add/json'))
        self.assertEqual(r.status_code, 400)


@unittest.skip('Requires credentials')
class DeletePage(ApiTests):
    _username = None
    _password = None

    def testNoGame(self):
        self.assertEqual(self._getErrorCode('delete.cgi'), 400)

    def testInvalidGame(self):
        self.assertEqual(self._getErrorCode('delete.cgi?game=123'), 404)

    def _testResponse(self, response):
        super(DeletePage, self)._testResponse(response)
        self.assertTrue("<!DOCTYPE html>" in response)

    def _getErrorCode(self, page):
        opener = self._getOpener()
        with self.assertRaises(urllib.error.HTTPError) as cm:
            opener.open(self._page(page)).read()
        return cm.exception.code

    def _getOpener(self):
        password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, self.urlBase, self._username, self._password)
        handler = urllib.request.HTTPBasicAuthHandler(password_mgr)
        return urllib.request.build_opener(handler)


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


