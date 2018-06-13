'''
Created on 27 Apr 2015

@author: jrem
'''
import os

from tntfl.ladder import TableFootballLadder
from unittest import TestCase
import tntfl.transforms.transforms as PresetTransforms


__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))


class Test(TestCase):
    def getLadder(self, filename):
        return 'file://' + os.path.join(__location__, filename)

    def testLadder(self):
        ladder = TableFootballLadder(self.getLadder("testLadder.txt"))
        ladder._theTime = 5000000004
        self.assertEqual(5, len(ladder.games))
        self.assertEqual(4, len(ladder.players))

        aaa = ladder.players['aaa']
        self.assertAlmostEqual(-2.30014, aaa.elo, places=5)

        self.assertEqual(1, ladder.getPlayerRank('ccc'))
        self.assertEqual(-1, ladder.getPlayerRank('inactive'))

    def testPlayerStreak(self):
        ladder = TableFootballLadder(self.getLadder("testStreak.txt"))

        streaky = ladder.players['streak']

        streaks = streaky.getStreaks()

        self.assertEquals(6, streaks['win'].count)
        self.assertEquals(2, streaks['lose'].count)
        self.assertEquals("(last game was a draw)", streaks['currentType'])

    def testTwoLadders(self):
        a = TableFootballLadder(self.getLadder("testLadder.txt"))
        b = TableFootballLadder(self.getLadder("testLadder.txt"))
        self.assertEquals(5, len(a.games))
        self.assertEquals(5, len(b.games))

    def testJrem(self):
        jl = TableFootballLadder(self.getLadder("jrem.ladder"))
        jrem = jl.players['jrem']
        streaks = jrem.getStreaks()

        self.assertEquals(0, streaks['current'].count)
        self.assertEquals(12, streaks['win'].count)
        self.assertEquals(14, streaks['lose'].count)

    def testGamesRange(self):
        ladder = TableFootballLadder(self.getLadder("testLadder.txt"), [5000000000, 5000000002])
        self.assertEqual(3, len(ladder.games))
        self.assertEqual(3, len(ladder.players))

    def testRankChange(self):
        ladder = TableFootballLadder(self.getLadder("test_rank.txt"))
        self.assertEqual(2, ladder.games[0].redPosAfter)
        self.assertEqual(1, ladder.games[0].bluePosAfter)
        self.assertEqual(1, ladder.games[1].redPosAfter)
        self.assertEqual(1, ladder.games[1].redPosChange)
        self.assertEqual(2, ladder.games[1].bluePosAfter)
        self.assertEqual(-1, ladder.games[1].bluePosChange)

    def testActivePlayers(self):
        ladder = TableFootballLadder(self.getLadder("test_active.txt"), transforms=PresetTransforms.no_transforms())
        self.assertEqual(3, ladder.getNumActivePlayers(5000000003))
        self.assertEqual(0, ladder.getNumActivePlayers(6000000002))
        self.assertEqual(2, ladder.getNumActivePlayers(6000000004))
