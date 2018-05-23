from builtins import object
from tntfl.game_store import GameStore
from tntfl.transforms.transforms import Transforms
import tntfl.transforms.transformer as Transformer


class CachingGameStore(object):
    def __init__(self, ladderFilePath):
        self._gameStore = GameStore(ladderFilePath)

    def loadGames(self, ladderTime, transforms):
        self._ladderTime = ladderTime
        return Transformer.transform(self._baseLoadGames, transforms)

    def _baseLoadGames(self):
        games = self._gameStore.getGames()
        if not self._ladderTime['now']:
            games = [g for g in games if self._ladderTime['range'][0] <= g.time <= self._ladderTime['range'][1]]
        return games

    def appendGame(self, game):
        self._gameStore.appendGame(game)

    def deleteGame(self, gameTime, deletedBy):
        return self._gameStore.deleteGame(gameTime, deletedBy)
