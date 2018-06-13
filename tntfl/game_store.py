from urllib.request import urlopen

from tntfl.game import Game


class GameStore(object):

    def __init__(self, ladderFilePath):
        self._ladderFilePath = ladderFilePath

    def getGames(self):
        games = []
        ladder = urlopen(self._ladderFilePath)
        for line in ladder:
            gameLine = line.decode('utf-8').split()
            numParts = len(gameLine)
            # Red player, red score, blue player, blue score, time[, deletedBy, deletedAt]
            if numParts == 5 or numParts == 7:
                game = Game(gameLine[0], gameLine[1], gameLine[2], gameLine[3], gameLine[4])
                games.append(game)
                if numParts == 7:
                    game.deletedBy = gameLine[5]
                    game.deletedAt = int(gameLine[6])
        return games
