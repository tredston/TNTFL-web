import unittest
import tntfl.transforms.elo as eloTransform
from tntfl.game import Game


class TestElo(unittest.TestCase):
    def test(self):
        games = [Game('red', 6, 'blue', 4, 1), Game('red', 1, 'blue', 9, 1)]

        games = eloTransform.do(games)

        self.assertAlmostEqual(-2.5, games[0].skillChangeToBlue)
        self.assertAlmostEqual(10.400, games[1].skillChangeToBlue, 3)
