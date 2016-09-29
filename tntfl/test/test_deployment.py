import urllib2
import unittest
import urlparse
import json
import os
import tntfl.test.bases as Bases


class Deployment(unittest.TestCase):
    urlBase = os.path.join('http://www/~tlr/', os.path.split(os.getcwd())[1]) + "/"

    def _getJsonFrom(self, page, query=None):
        response = self._get(page, query)
        self.assertTrue(len(response) > 0)
        return json.loads(response)

    def _page(self, page, query=None):
        return urlparse.urljoin(self.urlBase, page) + ('?' + query) if (query is not None) else ''

    def _get(self, page, query):
        return urllib2.urlopen(self._page(page, query)).read()


class Redirects(Deployment):
    def testIndexReachable(self):
        self._testPageReachable('')

    def testApiReachable(self):
        self._testPageReachable('api/')

    def testGameReachable(self):
        self._testPageReachable('game/1223308996/')

    def testGameJsonReachable(self):
        self._getJsonFrom('game/1223308996/json')

    def testHeadToHeadReachable(self):
        self._testPageReachable('headtohead/jrem/sam/')

    def testPlayerReachable(self):
        self._testPageReachable('player/jrem/')

    def testPlayerJsonReachable(self):
        self._getJsonFrom('player/ndt/json')

    def testPlayerGamesReachable(self):
        self._testPageReachable('player/jrem/games/')

    def testPlayerGamesJsonReachable(self):
        self._getJsonFrom('player/ndt/games/json')

    def testHeadToHeadGamesReachable(self):
        self._testPageReachable('headtohead/jrem/ndt/games/')

    def testHeadToHeadGamesJsonReachable(self):
        self._getJsonFrom('headtohead/cjm/ndt/games/json')

    def testReachable(self):
        self._testPageReachable('speculate/')

    def testStatsReachable(self):
        self._testPageReachable('stats/')

    def testRecentJsonReachable(self):
        self._getJsonFrom('recent/json')

    def testLadderJsonReachable(self):
        self._getJsonFrom('ladder/json')

    def testLadderRangeJsonReachable(self):
        self._getJsonFrom('ladder/?gamesFrom=1223308996&gamesTo=1223400000&view=json')

    def _testResponse(self, response):
        super(Pages, self)._testResponse(response)
        self.assertFalse("<!DOCTYPE html>" in response)


class DeletePage(Deployment):
    _username = None
    _password = None

    def testAuthenticationRequired(self):
        with self.assertRaises(urllib2.HTTPError) as cm:
            self._testPageReachable('game/1223308996/delete')
        e = cm.exception
        self.assertEqual(e.code, 401)

    @unittest.skip('requres credentials')
    def testReachable(self):
        password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, self.urlBase, self._username, self._password)
        handler = urllib2.HTTPBasicAuthHandler(password_mgr)
        opener = urllib2.build_opener(handler)
        response = opener.open(self._page('game/1223308996/delete')).read()
        self._testResponse(response)

    def _testResponse(self, response):
        super(DeletePage, self)._testResponse(response)
        self.assertTrue("<!DOCTYPE html>" in response)


class Pages(Deployment, Bases.Pages):
    pass


class SpeculatePage(Deployment, Bases.SpeculatePage):
    pass


class PageBits(Deployment, Bases.PageBits):
    pass


class PlayerApi(Deployment, Bases.PlayerApi):
    pass


class HeadToHeadApi(Deployment, Bases.HeadToHeadApi):
    pass


class RecentApi(Deployment, Bases.RecentApi):
    pass


class LadderApi(Deployment, Bases.LadderApi):
    pass


class GameApi(Deployment, Bases.GameApi):
    pass


class GamesApi(Deployment, Bases.GamesApi):
    pass
