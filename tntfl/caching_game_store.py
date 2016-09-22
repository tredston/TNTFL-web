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

    def getTransform(self):
        return self._transform.do

    def getCacheName(self):
        return '.cache.%s' % self._name


class CachingGameStore(object):
    _transforms = {
        'elo': Transform(eloTransform, 'elo'),
        'rank': Transform(rankTransform, 'rank'),
        'achievement': Transform(achievementTransform, 'achievement'),
    }
    _cacheFilePath = ".cache.achievement"

    def __init__(self, ladderFilePath, useCache):
        self._gameStore = GameStore(ladderFilePath)
        self._usingCache = useCache

    def loadGames(self, ladder, ladderTime):
        loaded = False
        if ladderTime['now']:
            loaded = self._loadFromCache(ladder)
        if not loaded:
            self._loadFromStore(ladder, ladderTime)

    def appendGame(self, game):
        self._deleteCache()
        self._gameStore.appendGame(game)

    def deleteGame(self, gameTime, deletedBy):
        self._deleteCache()
        return self._gameStore.deleteGame(gameTime, deletedBy)

    def _loadFromStore(self, ladder, ladderTime):
        games = self._gameStore.getGames()
        if not ladderTime['now']:
            games = [g for g in games if ladderTime['range'][0] <= g.time and g.time <= ladderTime['range'][1]]

        games = self._transform(self._transforms['elo'], games, ladderTime['now'])
        games = self._transform(self._transforms['rank'], games, ladderTime['now'])
        if ladderTime['now']:
            games = self._transform(self._transforms['achievement'], games, ladderTime['now'])
        self._loadGamesIntoLadder(games, ladder)

    def _transform(self, transform, games, writeCache):
        games = transform.getTransform()(games)
        if writeCache and self._usingCache:
            pickle.dump(games, open(transform.getCacheName(), 'wb'), pickle.HIGHEST_PROTOCOL)
        return games

    def _loadFromCache(self, ladder):
        if os.path.exists(self._cacheFilePath) and self._usingCache:
            games = pickle.load(open(self._cacheFilePath, 'rb'))
            self._loadGamesIntoLadder(games, ladder)
            return True
        return False

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
        if os.path.exists(self._cacheFilePath) and self._usingCache:
            os.remove(self._cacheFilePath)
