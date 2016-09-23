import os.path
import cPickle as pickle
import time
from tntfl.achievements import Achievements
from tntfl.player import Player, Streak
from tntfl.game_store import GameStore
from tntfl.game import Game
import tntfl.transforms.elo as eloTransform
import tntfl.transforms.rank as rankTransform
import tntfl.transforms.achievement as achievementTransform


class Transform(object):
    def __init__(self, transform, name):
        self._transform = transform
        self._name = name
        self._usingCache = True

    def setUseCache(self, useCache):
        self._usingCache = useCache

    def getCacheName(self):
        return '.cache.%s' % self._name

    def transform(self, games):
        games = self._transform(games)
        if self._usingCache:
            pickle.dump(games, open(self.getCacheName(), 'wb'), pickle.HIGHEST_PROTOCOL)
        return games

    def loadCached(self):
        if self._usingCache and os.path.exists(self.getCacheName()):
            return pickle.load(open(self.getCacheName(), 'rb'))
        return None


class CachingGameStore(object):
    def __init__(self, ladderFilePath, useCache):
        self._gameStore = GameStore(ladderFilePath)
        self._usingCache = useCache
        self._transforms = {
            'elo': Transform(eloTransform.do, 'elo'),
            'rank': Transform(rankTransform.do, 'rank'),
            'achievement': Transform(achievementTransform.do, 'achievement'),
        }

    def loadGames(self, ladder, ladderTime):
        transforms = [
            self._transforms['elo'],
            self._transforms['rank'],
        ]
        if ladderTime['now']:
            transforms.append(self._transforms['achievement'])

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
        for transform in self._transforms.values():
            if os.path.exists(transform.getCacheName()) and self._usingCache:
                os.remove(transform.getCacheName())
