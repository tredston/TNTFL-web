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

    def testLadder(self):
        l = TableFootballLadder(os.path.join(__location__, "testLadder.txt"), False)
        l._theTime = 5000000004
        self.assertEqual(5, len(l.games))
        self.assertEqual(4, len(l.players))

        aaa = l.players['aaa']
        self.assertAlmostEqual(-2.30014, aaa.elo, places=5)

        self.assertEqual(1, l.getPlayerRank('ccc'))
        self.assertEqual(-1, l.getPlayerRank('inactive'))

    def testPlayerStreak(self):
        l = TableFootballLadder(os.path.join(__location__, "testStreak.txt"), False)

        streaky = l.players['streak']

        streaks = streaky.getStreaks()

        self.assertEquals(6, streaks['win'].count)
        self.assertEquals(2, streaks['lose'].count)
        self.assertEquals("(last game was a draw)", streaks['currentType'])

    def testTwoLadders(self):
        a = TableFootballLadder(os.path.join(__location__, "testLadder.txt"), False)
        b = TableFootballLadder(os.path.join(__location__, "testLadder.txt"), False)
        self.assertEquals(5, len(a.games))
        self.assertEquals(5, len(b.games))

    def testJrem(self):
        jl = TableFootballLadder(os.path.join(__location__, "jrem.ladder"), False)
        jrem = jl.players['jrem']
        streaks = jrem.getStreaks()

        self.assertEquals(0, streaks['current'].count)
        self.assertEquals(12, streaks['win'].count)
        self.assertEquals(14, streaks['lose'].count)

    def testGamesRange(self):
        l = TableFootballLadder(os.path.join(__location__, "testLadder.txt"), False, [5000000000, 5000000002])
        self.assertEqual(3, len(l.games))
        self.assertEqual(3, len(l.players))

    def testRankChange(self):
        ladder = TableFootballLadder(os.path.join(__location__, "test_rank.txt"), False)
        self.assertEqual(2, ladder.games[0].redPosAfter)
        self.assertEqual(1, ladder.games[0].bluePosAfter)
        self.assertEqual(1, ladder.games[1].redPosAfter)
        self.assertEqual(1, ladder.games[1].redPosChange)
        self.assertEqual(2, ladder.games[1].bluePosAfter)
        self.assertEqual(-1, ladder.games[1].bluePosChange)

    def testActivePlayers(self):
        ladder = TableFootballLadder(os.path.join(__location__, "test_active.txt"), False, transforms=PresetTransforms.no_transforms())
        self.assertEqual(3, ladder.getNumActivePlayers(5000000003))
        self.assertEqual(0, ladder.getNumActivePlayers(6000000002))
        self.assertEqual(2, ladder.getNumActivePlayers(6000000004))
