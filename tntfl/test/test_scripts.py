import json
from mimetools import Message
import os
import shutil
from StringIO import StringIO
import subprocess
import tntfl.test.shared_get as Get


class Deployment(Get.TestRunner):
    def setUp(self):
        if 'QUERY_STRING' in os.environ:
            del(os.environ['QUERY_STRING'])

        if os.path.exists('ladder.txt'):
            os.rename('ladder.txt', 'ladder.actual')
        shutil.copyfile(os.path.join('tntfl', 'test', 'jrem.ladder'), 'ladder.txt')

    def tearDown(self):
        if os.path.exists('ladder.txt'):
            os.remove('ladder.txt')
        if os.path.exists('ladder.actual'):
            os.rename('ladder.actual', 'ladder.txt')

    def _getJson(self, page, query=None):
        response = self._get(page, query)
        headers = Message(StringIO(response.split('\n')[0]))
        self.assertEqual(headers['content-type'], 'application/json')
        body = ''.join(response.split('\n')[2:])
        self.assertTrue(len(body) > 0)
        return json.loads(body)

    def _page(self, page):
        return os.path.join(os.getcwd(), page)

    def _get(self, page, query):
        self._setQuery(query)
        return subprocess.check_output(['python', self._page(page)])

    def _setQuery(self, query):
        if query is not None:
            os.environ['QUERY_STRING'] = query

    def _getStatus(self, page, query):
        response = self._get(page, query)
        headers = response.split('\n')[0]
        return Message(StringIO(headers))['status']


class AddGame(Get.Tester, Deployment):
    def testAddGame(self):
        self._testPageReachable('game.cgi', 'method=add&redPlayer=foo&redScore=5&bluePlayer=bar&blueScore=5')

    def testAddGameApi(self):
        self._getJson('game.cgi', 'method=add&view=json&redPlayer=foo&redScore=5&bluePlayer=bar&blueScore=5')

    def testAddYellowStripeApi(self):
        self._getJson('game.cgi', 'method=add&view=json&redPlayer=foo&redScore=10&bluePlayer=bar&blueScore=0')


class Pages(Get.Pages, Deployment):
    pass


class SpeculatePage(Get.SpeculatePage, Deployment):
    pass


class LadderPage(Get.LadderPage, Deployment):
    pass


class RecentPage(Get.RecentPage, Deployment):
    pass


class PlayerApi(Get.PlayerApi, Deployment):
    def testNoPlayer(self):
        status = self._getStatus('player.cgi', 'view=json')
        self.assertEqual(status, '400 Bad Request')

    def testMissingPlayer(self):
        status = self._getStatus('player.cgi', 'view=json&player=missing')
        self.assertEqual(status, '404 Not Found')


class HeadToHeadApi(Get.HeadToHeadApi, Deployment):
    def testMissingPlayers(self):
        status = self._getStatus('headtohead.cgi', 'view=json')
        self.assertEqual(status, '400 Bad Request')

    def testInvalidPlayer(self):
        status = self._getStatus('headtohead.cgi', 'view=json&player1=jrem&player2=missing')
        self.assertEqual(status, '404 Not Found')


class RecentApi(Get.RecentApi, Deployment):
    pass


class LadderApi(Get.LadderApi, Deployment):
    pass


class GameApi(Get.GameApi, Deployment):
    def testNoGame(self):
        status = self._getStatus('game.cgi', 'view=json')
        self.assertEqual(status, '400 Bad Request')

    def testInvalidGame(self):
        status = self._getStatus('game.cgi', 'view=json&game=123')
        self.assertEqual(status, '404 Not Found')

    def testInvalidAdd(self):
        status = self._getStatus('game.cgi', 'view=json&method=add')
        self.assertEqual(status, '400 Bad Request')


class GamesApi(Get.GamesApi, Deployment):
    pass
