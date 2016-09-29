import os
from tntfl.game_store import GameStore
from tntfl.transforms.transforms import Transforms


class CachingGameStore(object):
    def __init__(self, ladderFilePath, useCache):
        self._gameStore = GameStore(ladderFilePath)
        self._usingCache = useCache

    def loadGames(self, ladderTime, transforms):
        cache = self._usingCache and ladderTime['now']
        for t in transforms:
            t.setUseCache(cache)
            
        games = None
        transformsToRun = []
        for t in reversed(transforms):
            games = t.loadCached()
            if games:
                break
            else:
                transformsToRun.append(t)

        if games is None:
            games = self._baseLoadGames(ladderTime)

        for t in reversed(transformsToRun):
            games = t.transform(games)

        return games

    def _baseLoadGames(self, ladderTime):
        games = self._gameStore.getGames()
        if not ladderTime['now']:
            games = [g for g in games if ladderTime['range'][0] <= g.time and g.time <= ladderTime['range'][1]]
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
