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
    def __init__(self, transform, name, usingCache):
        self._transform = transform
        self._name = name
        self._usingCache = usingCache

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

    def loadGames(self, ladder, ladderTime):
        cache = self._usingCache and ladderTime['now']
        transforms = [
            Transform(eloTransform.do, 'elo', cache),
            Transform(rankTransform.do, 'rank', cache),
        ]
        if ladderTime['now']:
            transforms.append(Transform(achievementTransform.do, 'achievement', cache))
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

        self._loadGamesIntoLadder(games, ladder)

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

    def _loadGamesIntoLadder(self, games, ladder):
        # games expected to be calculated!
        ladder.games = games
        for game in [g for g in ladder.games if not g.isDeleted()]:
            red = ladder.getPlayer(game.redPlayer)
            blue = ladder.getPlayer(game.bluePlayer)
            blue.game(game)
            red.game(game)
            red.achieve(game.redAchievements, game)
            blue.achieve(game.blueAchievements, game)

    def _deleteCache(self):
        for transform in self._transforms:
            if os.path.exists(transform.getCacheName()) and self._usingCache:
                os.remove(transform.getCacheName())
