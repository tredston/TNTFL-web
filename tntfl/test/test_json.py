import os
import unittest
from tntfl.game import Game
from tntfl.player import Player
import tntfl.template_utils as sut
from tntfl.achievements import FlawlessVictory
from tntfl.ladder import TableFootballLadder


__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))


def testLadder():
    return TableFootballLadder('file://' + os.path.join(__location__, "testLadder.txt"))


class GameJson(unittest.TestCase):
    def test(self):
        game = Game('red', 4, 'blue', 6, 1)
        game.skillChangeToBlue = 2
        game.redPosChange = -1
        game.redPosAfter = 2
        game.bluePosChange = 1
        game.bluePosAfter = 1

        actual = sut.gameToJson(game, '../')

        self.assertEqual(actual['red']['name'], 'red')
        self.assertEqual(actual['red']['href'], '../player/red/json')
        self.assertEqual(actual['red']['score'], 4)
        self.assertEqual(actual['red']['skillChange'], -2)
        self.assertEqual(actual['red']['rankChange'], -1)
        self.assertEqual(actual['red']['newRank'], 2)

        self.assertEqual(actual['blue']['name'], 'blue')
        self.assertEqual(actual['blue']['href'], '../player/blue/json')
        self.assertEqual(actual['blue']['score'], 6)
        self.assertEqual(actual['blue']['skillChange'], 2)
        self.assertEqual(actual['blue']['rankChange'], 1)
        self.assertEqual(actual['blue']['newRank'], 1)

        self.assertEqual(actual['positionSwap'], True)
        self.assertEqual(actual['date'], 1)


class LadderJson(unittest.TestCase):
    def testSimple(self):
        ladder = testLadder()

        actual = sut.ladderToJson(ladder, '../', True, False)

        self.assertEqual(len(actual), 4)
        self.assertIn('rank', actual[0])
        self.assertIn('name', actual[0])
        self.assertIn('skill', actual[0])
        self.assertIn('href', actual[0])

    def testPlayers(self):
        ladder = testLadder()

        actual = sut.ladderToJson(ladder, '../', True, True)

        self.assertEqual(len(actual), 4)
        self.assertIn('player', actual[0])
        self.assertIn('trend', actual[0])


class PerPlayerStatsJson(unittest.TestCase):
    def test(self):
        player = Player('foo')
        game = Game('foo', 4, 'red', 6, 1)
        game.skillChangeToBlue = -2
        player.games.append(game)

        actual = sut.perPlayerStatsToJson(sut.getPerPlayerStats(player))

        self.assertEqual(len(actual), 1)
        self.assertEqual(actual[0]['opponent'], 'red')
        self.assertEqual(actual[0]['skillChange'], 2)
        self.assertEqual(actual[0]['for'], 4)
        self.assertEqual(actual[0]['against'], 6)
        self.assertEqual(actual[0]['games'], 1)
        self.assertEqual(actual[0]['wins'], 0)
        self.assertEqual(actual[0]['losses'], 1)


class PlayerJson(unittest.TestCase):
    def test(self):
        ladder = testLadder()

        actual = sut.playerToJson(ladder.players['aaa'], ladder)

        self.assertEqual(actual['name'], 'aaa')
        self.assertEqual(actual['rank'], -1)
        self.assertEqual(actual['activity'], 0)
        self.assertAlmostEqual(actual['skill'], -2.30014, 5)
        self.assertEqual(actual['total']['for'], 14)
        self.assertEqual(actual['total']['against'], 16)
        self.assertEqual(actual['total']['games'], 3)
        self.assertEqual(actual['total']['gamesAsRed'], 2)
        self.assertEqual(actual['total']['wins'], 0)
        self.assertEqual(actual['total']['losses'], 1)
        self.assertEqual(actual['total']['gamesToday'], 0)
        self.assertEqual(actual['games']['href'], 'games/json')


class PlayerAchievementsJson(unittest.TestCase):
    def test(self):
        player = Player('foo')
        player.achieve([FlawlessVictory().__class__], Game('foo', 4, 'red', 6, 1))

        actual = sut.getPlayerAchievementsJson(player)

        self.assertEqual(len(actual), 25)
        self.assertEqual(len([a for a in actual if 'time' in a]), 1)
        self.assertIn('name', actual[0])
        self.assertIn('description', actual[0])
        self.assertIn('time', actual[0])


class StatsJson(unittest.TestCase):
    def test(self):
        ladder = testLadder()

        actual = sut.getStatsJson(ladder, '../')

        self.assertIn('totals', actual)
        self.assertIn('games', actual['totals'])
        self.assertIn('players', actual['totals'])
        self.assertIn('activePlayers', actual['totals'])
        self.assertIn('achievements', actual['totals'])

        self.assertIn('records', actual)
        self.assertIn('winningStreak', actual['records'])
        self.assertIn('player', actual['records']['winningStreak'])
        self.assertIn('count', actual['records']['winningStreak'])
        self.assertIn('mostSignificant', actual['records'])
        self.assertIn('leastSignificant', actual['records'])

        self.assertIn('belt', actual)
        self.assertIn('current', actual['belt'])
        self.assertIn('player', actual['belt']['current'])
        self.assertIn('count', actual['belt']['current'])
        self.assertIn('best', actual['belt'])
        self.assertIn('player', actual['belt']['best'])
        self.assertIn('count', actual['belt']['best'])

        self.assertIn('gamesPerWeek', actual)
