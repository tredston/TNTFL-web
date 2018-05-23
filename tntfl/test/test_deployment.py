import abc
import json
import os
import shutil
import unittest
import urllib.error
import urllib.parse
import urllib.request
from email.parser import Parser

from entry import app


class Deployment(unittest.TestCase, metaclass=abc.ABCMeta):
    @classmethod
    def _backupFilename(cls, filename):
        return '%s.actual' % filename

    @classmethod
    def _backupFile(cls, filename):
        if os.path.exists(filename):
            os.rename(filename, cls._backupFilename(filename))

    @classmethod
    def _restoreFile(cls, filename):
        if os.path.exists(filename):
            os.remove(filename)
        if os.path.exists(cls._backupFilename(filename)):
            os.rename(cls._backupFilename(filename), filename)

    @classmethod
    def setUpClass(cls):
        cls._backupFile('tntfl.cfg')
        cls._backupFile('ladder.txt')
        shutil.copyfile(os.path.join('tntfl', 'test', 'jrem.ladder'), 'ladder.txt')

    @classmethod
    def tearDownClass(cls):
        cls._restoreFile('ladder.txt')
        cls._restoreFile('tntfl.cfg')

    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def _getJson(self, page, query=None):
        response = self._get(page, query)
        self.assertEqual(response.status_code, 200)
        return json.loads(response.data.decode('utf-8'))

    def _page(self, url, query=None):
        if query is not None:
            url += '?' + query
        return url

    def _get(self, page, query):
        return self.client.get(self._page(page, query))

    def _getHeaders(self, response):
        headers = Parser().parsestr(response.split('\n', 1)[0])
        return headers

    def _testPageReachable(self, page, query=None):
        response = self._get(page, query)
        self.assertEqual(response.status_code, 200)

    def _testResponse(self, response):
        self.assertTrue("Traceback (most recent call last):" not in response)


class Redirects(Deployment):
    def testIndexReachable(self):
        self._testPageReachable('/')

    def testApiReachable(self):
        self._testPageReachable('/api/')

    def testGameReachable(self):
        self._testPageReachable('/game/1223308996')

    def testDeleteReachable(self):
        self._testPageReachable('/game/1223308996/delete')

    def testPlayerReachable(self):
        self._testPageReachable('/player/jrem')

    def testPlayerGamesReachable(self):
        self._testPageReachable('/player/jrem/games')

    def testHeadToHeadReachable(self):
        self._testPageReachable('/headtohead/jrem/sam')

    def testHeadToHeadGamesReachable(self):
        self._testPageReachable('/headtohead/jrem/ndt/games')

    def testSpeculateReachable(self):
        self._testPageReachable('/speculate/')

    def testStatsReachable(self):
        self._testPageReachable('/stats/')

    def testHistoric(self):
        self._testPageReachable('/historic/')


@unittest.skip('No add')
class AddGame(Deployment):
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
class DeletePage(Deployment):
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


class PlayerApi(Deployment):
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


class HeadToHeadApi(Deployment):
    def testNoPlayers(self):
        r = self.client.get(self._page('/headtohead/'))
        self.assertEqual(r.status_code, 404)

    def testInvalidPlayer(self):
        r = self.client.get(self._page('/headtohead/jrem/missing/json'))
        self.assertEqual(r.status_code, 404)

    def testHeadToHeadGamesJson(self):
        response = self._getJson('/headtohead/jrem/prc/games/json')
        self.assertEqual(len(response), 11)
        self.assertEqual(response[0]['date'], 1392832399)


class RecentApi(Deployment):
    def testRecentJsonReachable(self):
        response = self._getJson('/recent/json')
        self.assertEqual(len(response), 10)
        self.assertEqual(response[0]['date'], 1430991614)


class LadderApi(Deployment):
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


class GameApi(Deployment):
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


class GamesApi(Deployment):
    def assertDictEqualNoHref(self, first, second):
        del(first['red']['href'])
        del(first['blue']['href'])
        del(second['red']['href'])
        del(second['blue']['href'])
        self.maxDiff = None
        self.assertDictEqual(first, second)

    def test(self):
        response = self._getJson('/games/1430402614/1430991615/json')
        self.assertEqual(len(response), 5)
        self.assertEqual(response[0]['date'], 1430402615)
        self.assertDictEqualNoHref(response[0], self._getJson('game/1430402615/json'))
        self.assertEqual(response[4]['date'], 1430991614)

    def testLimit(self):
        response = self._getJson('/games/1430402614/1430991615/json', 'limit=2')
        self.assertEqual(len(response), 2)
        self.assertEqual(response[0]['date'], 1430928939)
        self.assertEqual(response[1]['date'], 1430991614)

    def testDeleted(self):
        response = self._getJson('/games/1430402614/1430991615/json', 'includeDeleted=1')
        self.assertEqual(len(response), 6)
        self.assertEqual(response[3]['deleted']['at'], 1430915500)
        self.assertEqual(response[3]['deleted']['by'], 'eu')
        self.assertEqual(response[3]['date'], 1430915499)

    def testNoDeleted(self):
        response = self._getJson('/games/1430402614/1430991615/json', 'includeDeleted=0')
        self.assertEqual(len(response), 5)
        self.assertEqual(response[3]['date'], 1430928939)


class PunditApi(Deployment):
    def testNoQuery(self):
        r = self.client.get(self._page('/pundit/json'))
        self.assertEqual(r.status_code, 400)

    def testNoGame(self):
        r = self.client.get(self._page('/pundit/json', 'at='))
        self.assertEqual(r.status_code, 400)

    def testMissingGame(self):
        r = self.client.get(self._page('/pundit/json', 'at=123'))
        self.assertEqual(r.status_code, 404)

    def test(self):
        response = self._getJson('/pundit/json', 'at=1223308996')
        self.assertEqual(len(response.keys()), 1)
        self.assertSetEqual(set(response['1223308996']['facts']), {
            "That was jrem's 2nd most significant game.",
            "That game featured jrem's 10th goal against kjb.",
        })

    def testEmpty(self):
        response = self._getJson('/pundit/json', 'at=1430991614')
        self.assertEqual(response, {'1430991614': {'facts': []}})

    def testMultiple(self):
        response = self._getJson('/pundit/json', 'at=1223308996,1430991614')
        self.assertEqual(len(response.keys()), 2)
        self.assertSetEqual(set(response['1223308996']['facts']), {
            "That was jrem's 2nd most significant game.",
            "That game featured jrem's 10th goal against kjb.",
        })
        self.assertEqual(response['1430991614']['facts'], [])


class PredictApi(Deployment):
    def test(self):
        response = self._getJson('/predict/0/0/json')
        self.assertEqual(response['blueGoalRatio'], 0.5)

    def test2(self):
        response = self._getJson('/predict/10/95.882/json')
        self.assertAlmostEqual(response['blueGoalRatio'], 0.75, 4)

    def test2Mirrored(self):
        response = self._getJson('/predict/95.882/10/json')
        self.assertAlmostEqual(response['blueGoalRatio'], 0.25, 4)

    def testNegative(self):
        response = self._getJson('/predict/-95.882/10/json')
        self.assertAlmostEqual(response['blueGoalRatio'], 0.79485, 4)


class ActivePlayersApi(Deployment):
    def test(self):
        response = self._getJson('/activeplayers/json')
        self.assertEqual(len(response.keys()), 1)
        self.assertEqual(response[next(iter(response))], {'count': 0})

    def testAtDate(self):
        response = self._getJson('/activeplayers/json', 'at=1430402614')
        self.assertEqual(response['1430402614'], {'count': 13})

    def testAtDates(self):
        response = self._getJson('/activeplayers/json', 'at=1420000000,1430402614')
        self.assertEqual(response['1420000000'], {'count': 5})
        self.assertEqual(response['1430402614'], {'count': 13})


class SpeculateApi(Deployment):
    def testNoGames(self):
        response = self._getJson('/speculate/json')
        self.assertTrue('entries' in response)
        self.assertTrue('games' in response)
        self.assertEqual(len(response['games']), 0)

    def testGames(self):
        response = self._getJson('/speculate/json', 'previousGames=foo%2C10%2C0%2Cbar%2Cfoo%2C10%2C0%2Cbat')
        self.assertEqual(len(response['entries']), 3)
        self.assertEqual(len(response['games']), 2)
        self.assertNotEqual(response['games'][0]['date'], response['games'][1]['date'])


class StatsApi(Deployment):
    def test(self):
        response = self._getJson('/stats/json')
        self.assertIn('totals', response)
        self.assertIn('games', response['totals'])
        self.assertGreater(response['totals']['games'], 0)
        self.assertIn('players', response['totals'])
        self.assertGreater(response['totals']['players'], 0)
        self.assertIn('activePlayers', response['totals'])
        self.assertIn('achievements', response['totals'])
        self.assertGreater(len(response['totals']['achievements']), 0)
        self.assertIn('records', response)
        self.assertIn('winningStreak', response['records'])
        self.assertIn('player', response['records']['winningStreak'])
        self.assertIn('count', response['records']['winningStreak'])
        self.assertIn('mostSignificant', response['records'])
        self.assertEqual(len(response['records']['mostSignificant']), 5)
        self.assertIn('leastSignificant', response['records'])
        self.assertEqual(len(response['records']['leastSignificant']), 5)
        self.assertIn('gamesPerWeek', response)
        self.assertGreater(len(response['gamesPerWeek']), 0)

