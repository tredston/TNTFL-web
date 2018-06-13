from entry import app
from tntfl.test.blueprints.test_case import TestCase
from tntfl.test.functional_test_base import FunctionalTestBase


class ApiTests(TestCase, FunctionalTestBase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()


class HeadToHeadApi(ApiTests):
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


class RecentApi(ApiTests):
    def testRecentJsonReachable(self):
        response = self._getJson('/recent/json')
        self.assertEqual(len(response), 10)
        self.assertEqual(response[0]['date'], 1430991614)


class GamesApi(ApiTests):
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


class PunditApi(ApiTests):
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


class PredictApi(ApiTests):
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


class ActivePlayersApi(ApiTests):
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


class SpeculateApi(ApiTests):
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


class StatsApi(ApiTests):
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
