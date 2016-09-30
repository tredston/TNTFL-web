import abc
import unittest


class TestRunner(unittest.TestCase):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def _getJson(self, page, query=None):
        """
        Return JSON content.
        """
        pass

    @abc.abstractmethod
    def _get(self, page, query):
        """
        Return the page content.
        """
        pass

    def _testPageReachable(self, page, query=None):
        self._testResponse(self._get(page, query))

    def _testResponse(self, response):
        self.assertTrue("Traceback (most recent call last):" not in response)


class Pages(object):
    def testIndexReachable(self):
        self._testPageReachable('index.cgi')

    def testAchievementsReachable(self):
        self._testPageReachable('achievements.cgi')

    def testApiReachable(self):
        self._testPageReachable('api.cgi')

    def testGameReachable(self):
        self._testPageReachable('game.cgi', 'method=view&game=1223308996')

    def testPlayerReachable(self):
        self._testPageReachable('player.cgi', 'player=jrem')

    def testPlayerGamesReachable(self):
        self._testPageReachable('player.cgi', 'player=pwc&method=games')

    def testHeadToHeadReachable(self):
        self._testPageReachable('headtohead.cgi', 'player1=jrem&player2=sam')

    def testHeadToHeadGamesReachable(self):
        self._testPageReachable('headtohead.cgi', 'player1=jrem&player2=sam&method=games')

    def testSpeculateReachable(self):
        self._testPageReachable('speculate.cgi')

    def testStatsReachable(self):
        self._testPageReachable('stats.cgi')

    def testHistoricReachable(self):
        self._testPageReachable('historic.cgi')

    def _testResponse(self, response):
        super(Pages, self)._testResponse(response)
        self.assertTrue("<!DOCTYPE html>" in response)


class SpeculatePage(object):
    def testAGame(self):
        self._testPageReachable('speculate.cgi', 'redPlayer=tlr&redScore=10&blueScore=0&bluePlayer=cjm&previousGames=')

    def testMultipleGames(self):
        self._testPageReachable('speculate.cgi', 'redPlayer=acas&redScore=10&blueScore=0&bluePlayer=epb&previousGames=tlr%2C10%2C0%2Ccjm%2Cjma%2C10%2C0%2Cmsh')

    def _testResponse(self, response):
        super(SpeculatePage, self)._testResponse(response)
        self.assertTrue("<!DOCTYPE html>" in response)
        self.assertTrue('Speculative Ladder' in response)


class PageBits(object):
    def testLadderReachable(self):
        self._testPageReachable('ladder.cgi')

    def testRecentReachable(self):
        self._testPageReachable('recent.cgi')


class PlayerApi(object):
    def testPlayerJson(self):
        response = self._getJson('player.cgi', 'player=ndt&view=json')
        self.assertEqual(response['name'], "ndt")
        self.assertEqual(response['rank'], -1)
        self.assertEqual(response['active'], False)
        self.assertEqual(response['skill'], 65.7308777725)
        self.assertEqual(response['overrated'], -20.2998078551)
        self.assertEqual(response['total']['for'], 2895)
        self.assertEqual(response['total']['against'], 2005)
        self.assertEqual(response['total']['games'], 490)
        self.assertEqual(response['total']['wins'], 286)
        self.assertEqual(response['total']['losses'], 96)
        self.assertEqual(response['total']['gamesToday'], 0)

    def testPlayerGamesJsonReachable(self):
        response = self._getJson('player.cgi', 'player=ndt&method=games&view=json')
        self.assertEqual(len(response), 490)
        self.assertEqual(response[0]['date'], 1392725064)


class HeadToHeadApi(object):
    def testHeadToHeadGamesJsonReachable(self):
        response = self._getJson('headtohead.cgi', 'player1=cjm&player2=ndt&method=games&view=json')
        self.assertEqual(len(response), 9)
        self.assertEqual(response[0]['date'], 1394037228)


class RecentApi(object):
    def testRecentJsonReachable(self):
        response = self._getJson('recent.cgi', 'view=json')


class LadderApi(object):
    def testReachable(self):
        response = self._getJson('ladder.cgi', 'view=json')

    def testRange(self):
        response = self._getJson('ladder.cgi', 'gamesFrom=1223308996&gamesTo=1223400000&view=json')
        self.assertEqual(len(response), 3)
        self.assertEqual(response[0]['rank'], 1)
        self.assertEqual(response[0]['name'], 'jrem')
        self.assertEqual(response[0]['skill'], 16.5027380839)
        self.assertEqual(response[2]['rank'], 3)
        self.assertEqual(response[2]['name'], 'kjb')
        self.assertEqual(response[2]['skill'], -12.5)


class GameApi(object):
    def test(self):
        response = self._getJson('game.cgi', 'method=view&game=1223308996&view=json')
        self.assertEqual(response['red']['name'], 'jrem')
        self.assertEqual(response['red']['href'], '../../player/jrem/json')
        self.assertEqual(response['red']['score'], 10)
        self.assertEqual(response['red']['skillChange'], 14.8698309141)
        self.assertEqual(response['red']['rankChange'], 0)
        self.assertEqual(response['red']['newRank'], 15)
        redAchievements = response['red']['achievements']
        self.assertEqual(len(redAchievements), 3)
        self.assertEqual(redAchievements[0]['name'], "Flawless Victory")
        self.assertEqual(redAchievements[0]['description'], "Beat an opponent 10-0")
        self.assertEqual(redAchievements[1]['name'], "Early Bird")
        self.assertEqual(redAchievements[1]['description'], "Play and win the first game of the day")
        self.assertEqual(redAchievements[2]['name'], "Pok&#233;Master")
        self.assertEqual(redAchievements[2]['description'], "Collect all the scores")

        self.assertEqual(response['blue']['name'], 'kjb')
        self.assertEqual(response['blue']['href'], '../../player/kjb/json')
        self.assertEqual(response['blue']['score'], 0)
        self.assertEqual(response['blue']['skillChange'], -14.8698309141)
        self.assertEqual(response['blue']['rankChange'], 0)
        self.assertEqual(response['blue']['newRank'], 14)
        self.assertEqual(response['blue']['achievements'], [])

        self.assertEqual(response['positionSwap'], False)
        self.assertEqual(response['date'], 1223308996)

    def testPositionSwap(self):
        response = self._getJson('game.cgi', 'method=view&game=1443785561&view=json')
        self.assertEqual(response['positionSwap'], True)
        self.assertEqual(response['date'], 1443785561)


class GamesApi(object):
    def test(self):
        response = self._getJson('games.cgi', 'view=json&from=1120830176&to=1120840777')
        self.assertEqual(len(response), 3)

        self.assertEqual(response[0]['red']['name'], 'lefh')
        self.assertEqual(response[0]['red']['href'], 'player/lefh/json')
        self.assertEqual(response[0]['red']['score'], 5)
        self.assertEqual(response[0]['red']['skillChange'], -0.497657033239)
        self.assertEqual(response[0]['red']['rankChange'], 0)
        self.assertEqual(response[0]['red']['newRank'], 2)
        self.assertEqual(response[0]['red']['achievements'], [])

        self.assertEqual(response[0]['blue']['name'], 'pdw')
        self.assertEqual(response[0]['blue']['href'], 'player/pdw/json')
        self.assertEqual(response[0]['blue']['score'], 5)
        self.assertEqual(response[0]['blue']['skillChange'], 0.497657033239)
        self.assertEqual(response[0]['blue']['rankChange'], 0)
        self.assertEqual(response[0]['blue']['newRank'], 3)
        self.assertEqual(response[0]['blue']['achievements'], [])

        self.assertEqual(response[0]['positionSwap'], False)
        self.assertEqual(response[0]['date'], 1120830176)
        self.assertEqual(response[1]['date'], 1120834874)
        self.assertEqual(response[2]['date'], 1120840777)

    def testLimit(self):
        response = self._getJson('games.cgi', 'view=json&from=1448887743&to=1448897743&limit=2')
        self.assertEqual(len(response), 2)
        self.assertEqual(response[0]['date'], 1448895666)
        self.assertEqual(response[1]['date'], 1448897511)

    def testDeleted(self):
        response = self._getJson('games.cgi', 'view=json&from=1448887743&to=1448890745&includeDeleted=1')
        self.assertEqual(len(response), 4)
        self.assertEqual(response[0]['deleted']['at'], 1448889773)
        self.assertEqual(response[0]['deleted']['by'], 'tlr')
        self.assertEqual(response[0]['date'], 1448889571)
        self.assertEqual(response[1]['date'], 1448889749)

    def testNoDeleted(self):
        response = self._getJson('games.cgi', 'view=json&from=1448887743&to=1448890745&includeDeleted=0')
        self.assertEqual(len(response), 3)
        self.assertEqual(response[0]['date'], 1448889749)
