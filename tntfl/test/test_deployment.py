import urllib2
import unittest
import urlparse
import json
import os
import re
import shutil
import tntfl.test.shared_get as Get


class Deployment(Get.TestRunner):
    urlBase = os.path.join('http://www/~tlr/', os.path.split(os.getcwd())[1]) + "/"

    def setUp(self):
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
        self.assertTrue(len(response) > 0)
        return json.loads(response)

    def _page(self, page, query=None):
        url = urlparse.urljoin(self.urlBase, page)
        if query is not None:
            url += '?' + query
        return url

    def _get(self, page, query):
        return urllib2.urlopen(self._page(page, query)).read()


class Redirects(Get.Tester, Deployment):
    def testIndexReachable(self):
        self._testPageReachable('')

    def testApiReachable(self):
        self._testPageReachable('api/')

    def testGameReachable(self):
        self._testPageReachable('game/1223308996/')

    def testGameJsonReachable(self):
        self._getJson('game/1223308996/json')

    def testGamesJsonReachable(self):
        self._getJson('games/1223308996/1223400000/json')

    def testHeadToHeadReachable(self):
        self._testPageReachable('headtohead/jrem/sam/')

    def testPlayerReachable(self):
        self._testPageReachable('player/jrem/')

    def testPlayerJsonReachable(self):
        self._getJson('player/ndt/json')

    def testPlayerGamesReachable(self):
        self._testPageReachable('player/jrem/games/')

    def testPlayerGamesJsonReachable(self):
        self._getJson('player/ndt/games/json')

    def testHeadToHeadGamesReachable(self):
        self._testPageReachable('headtohead/jrem/ndt/games/')

    def testHeadToHeadGamesJsonReachable(self):
        self._getJson('headtohead/cjm/ndt/games/json')

    def testSpeculateReachable(self):
        self._testPageReachable('speculate/')

    def testStatsReachable(self):
        self._testPageReachable('stats/')

    def testRecentJsonReachable(self):
        self._getJson('recent/json')

    def testLadderJsonReachable(self):
        self._getJson('ladder/json')

    def testLadderRangeJsonReachable(self):
        self._getJson('ladder/1223308996/1223400000/json')

    def testLadderRangeRawJsonReachable(self):
        self._getJson('ladder/?gamesFrom=1223308996&gamesTo=1223400000&view=json')

    def testPundit(self):
        self._getJson('pundit/1223308996')

    def _testResponse(self, response):
        super(Redirects, self)._testResponse(response)
        self.assertTrue(re.search('<!DOCTYPE html>', response, re.IGNORECASE))


class DeletePage(Get.Tester, Deployment):
    _username = None
    _password = None

    def testAuthenticationRequired(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('game/1223308996/delete')
        e = cm.exception
        self.assertEqual(e.code, 401)

    @unittest.skip('requires credentials')
    def testReachable(self):
        password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, self.urlBase, self._username, self._password)
        handler = urllib2.HTTPBasicAuthHandler(password_mgr)
        opener = urllib2.build_opener(handler)
        response = opener.open(self._page('game/1223308996/delete')).read()
        self._testResponse(response)

    @unittest.skip('requires credentials')
    def testNoGame(self):
        password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, self.urlBase, self._username, self._password)
        handler = urllib2.HTTPBasicAuthHandler(password_mgr)
        opener = urllib2.build_opener(handler)
        with self.assertRaises(urllib2.HTTPError) as cm:
            opener.open(self._page('delete.cgi')).read()
        e = cm.exception
        self.assertEqual(e.code, 400)

    @unittest.skip('requires credentials')
    def testInvalidGame(self):
        password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, self.urlBase, self._username, self._password)
        handler = urllib2.HTTPBasicAuthHandler(password_mgr)
        opener = urllib2.build_opener(handler)
        with self.assertRaises(urllib2.HTTPError) as cm:
            opener.open(self._page('delete.cgi?game=123')).read()
        e = cm.exception
        self.assertEqual(e.code, 404)

    def _testResponse(self, response):
        super(DeletePage, self)._testResponse(response)
        self.assertTrue("<!DOCTYPE html>" in response)


class Pages(Get.Pages, Deployment):
    pass


class LadderPage(Get.LadderPage, Deployment):
    pass


class PlayerApi(Get.PlayerApi, Deployment):
    def testNoPlayer(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('player')
        e = cm.exception
        self.assertEqual(e.code, 404)
        # TODO
        # self.assertEqual(e.code, 400)

    def testMissingPlayer(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('player/missing')
        e = cm.exception
        self.assertEqual(e.code, 404)


class HeadToHeadApi(Get.HeadToHeadApi, Deployment):
    def testNoPlayers(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('headtohead/')
        e = cm.exception
        self.assertEqual(e.code, 404)
        # TODO
        # self.assertEqual(e.code, 400)

    def testInvalidPlayer(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('headtohead/jrem/missing')
        e = cm.exception
        self.assertEqual(e.code, 404)


class RecentApi(Get.RecentApi, Deployment):
    pass


class LadderApi(Get.LadderApi, Deployment):
    pass


class GameApi(Get.GameApi, Deployment):
    def testNoGame(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('game')
        e = cm.exception
        self.assertEqual(e.code, 404)
        # TODO
        # self.assertEqual(e.code, 400)

    def testInvalidGame(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('game/123')
        e = cm.exception
        self.assertEqual(e.code, 404)

    def testInvalidAdd(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('game/add')
        e = cm.exception
        self.assertEqual(e.code, 500)
        # TODO
        # self.assertEqual(e.code, 400)


class GamesApi(Get.GamesApi, Deployment):
    pass


class PunditApi(Get.PunditApi, Deployment):
    pass


class PredictApi(Get.PredictApi, Deployment):
    pass


class ActivePlayersApi(Get.ActivePlayersApi, Deployment):
    pass


class SpeculateApi(Get.SpeculateApi, Deployment):
    pass
