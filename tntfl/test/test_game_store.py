import os
import unittest

from tntfl.game_store import GameStore


class TestGameStore(unittest.TestCase):
    def getLadder(self, filename):
        return 'file://' + filename

    def testRead(self):
        try:
            game1 = ("tlr", 0, "cjm", 10, 1445443858)
            filePath = "/tmp/temp.txt"
            with open(filePath, 'w') as temp:
                temp.write("\n%s %s %s %s %.0f" % game1)

            sut = GameStore(self.getLadder(filePath))
            result = sut.getGames()
            self.assertEqual(len(result), 1)
            self._assertGame(result[0], game1)
        finally:
            os.remove(filePath)

    def testReadDeleted(self):
        try:
            game1 = ("tlr", 0, "cjm", 10, 1445443858, "cjm", 1445443859)
            filePath = "/tmp/temp.txt"
            with open(filePath, 'w') as temp:
                temp.write("\n%s %s %s %s %.0f %s %.0f" % game1)

            sut = GameStore(self.getLadder(filePath))
            result = sut.getGames()
            self.assertEqual(len(result), 1)
            self._assertGame(result[0], game1)
        finally:
            os.remove(filePath)

    def _assertGame(self, resultGame, expectedTuple):
        self.assertEqual(resultGame.redPlayer, expectedTuple[0])
        self.assertEqual(resultGame.redScore, expectedTuple[1])
        self.assertEqual(resultGame.bluePlayer, expectedTuple[2])
        self.assertEqual(resultGame.blueScore, expectedTuple[3])
        self.assertEqual(resultGame.time, expectedTuple[4])
        if len(expectedTuple) == 5:
            expectedTuple += (None, None)
        self.assertEqual(resultGame.deletedBy, expectedTuple[5])
        self.assertEqual(resultGame.deletedAt, expectedTuple[6])
