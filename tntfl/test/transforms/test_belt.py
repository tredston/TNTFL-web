import unittest

import tntfl.transforms.belt as beltTransform
from tntfl import constants
from tntfl.game import Game


class TestBelt(unittest.TestCase):
    def _assert(self, beltGame, freeBelt, wonBelt):
        self.assertEqual(beltGame['freeBelt'], freeBelt)
        self.assertEqual(beltGame['wonBelt'], wonBelt)

    def testFirstDraw(self):
        games = [
            Game('red', 5, 'blue', 5, 0),
        ]

        games = beltTransform.do(games)
        self._assert(games[0], True, None)

    def testTransfer(self):
        games = [
            Game('red', 6, 'blue', 4, 0),
            Game('red', 5, 'blue', 5, 1),
            Game('red', 6, 'blue', 4, 2),
            Game('red', 1, 'blue', 9, 3),
        ]

        games = beltTransform.do(games)
        self._assert(games[0], True, 'red')
        self._assert(games[1], False, None)
        self._assert(games[2], False, None)
        self._assert(games[3], False, 'blue')

    def testFreeBelt(self):
        timeout = 60 * 60 * 24 * constants.DAYS_INACTIVE
        games = [
            Game('red', 6, 'blue', 4, 0),
            Game('red', 5, 'blue', 5, 1),
            Game('red', 6, 'blue', 4, 2),
            Game('foo', 1, 'blue', 9, timeout + 3),
        ]

        games = beltTransform.do(games)
        self._assert(games[0], True, 'red')
        self._assert(games[1], False, None)
        self._assert(games[2], False, None)
        self._assert(games[3], True, 'blue')


class TestIsFirstGame(unittest.TestCase):
    def testNoGames(self):
        actual = beltTransform.isFirstGame({}, 0)
        self.assertTrue(actual)

    def testRecentGame(self):
        players = {}
        player = beltTransform.getPlayer(players, 'red')
        player.hasBelt = True
        player.lastGameTime = 1000
        timeout = 60 * 60 * 24 * constants.DAYS_INACTIVE
        actual = beltTransform.isFirstGame(players, 1000 + timeout)
        self.assertFalse(actual)
        self.assertTrue(player.hasBelt)

    def testInactive(self):
        players = {}
        player = beltTransform.getPlayer(players, 'red')
        player.hasBelt = True
        player.lastGameTime = 1000
        timeout = 60 * 60 * 24 * constants.DAYS_INACTIVE
        actual = beltTransform.isFirstGame(players, 1001 + timeout)
        self.assertTrue(actual)
        self.assertFalse(player.hasBelt)


class TestGetBeltHistory(unittest.TestCase):
    def _newGame(self, red, blue, wonBelt):
        return {'game': Game(red, 5, blue, 5, 1), 'wonBelt': wonBelt}

    def testCurrent(self):
        games = [
            self._newGame('red', 'blue', 'red'),
            self._newGame('red', 'blue', 'blue'),
        ]

        actual = beltTransform.getBeltHistory(games)

        self.assertEqual(len(actual), 2)
