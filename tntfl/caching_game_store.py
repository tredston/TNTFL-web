from tntfl.game_store import GameStore
from tntfl.transforms.transforms import Transforms
import tntfl.transforms.transformer as Transformer


class CachingGameStore(object):
    def __init__(self, ladderFilePath, useCache):
        self._gameStore = GameStore(ladderFilePath)
        self._usingCache = useCache

    def loadGames(self, ladderTime, transforms):
        self._ladderTime = ladderTime
        return Transformer.transform(self._baseLoadGames, transforms, self._usingCache)

    def _baseLoadGames(self):
        games = self._gameStore.getGames()
        if not self._ladderTime['now']:
            games = [g for g in games if self._ladderTime['range'][0] <= g.time and g.time <= self._ladderTime['range'][1]]
        return games

    def appendGame(self, game):
        self._deleteCache()
        self._gameStore.appendGame(game)

    def deleteGame(self, gameTime, deletedBy):
        self._deleteCache()
        return self._gameStore.deleteGame(gameTime, deletedBy)

    def _deleteCache(self):
        for transform in Transforms.values():
            transform.deleteCache()
