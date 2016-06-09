import os.path
import cPickle as pickle
import time
from tntfl.achievements import Achievements
from tntfl.player import Player, Streak
from tntfl.game_store import GameStore
from tntfl.game import Game


class CachingGameStore(object):
    _cacheFilePath = "cache"

    def __init__(self, ladderFilePath, useCache):
        self._gameStore = GameStore(ladderFilePath)
        self._usingCache = useCache

    def loadGames(self, ladder, ladderTime):
        loaded = False
        if ladderTime['now']:
            loaded = self._loadFromCache(ladder)
        if not loaded:
            self._loadFromStore(ladder, ladderTime)
            if ladderTime['now']:
                self._writeToCache(ladder)

    def writeGame(self, game):
        self._deleteCache()
        self._gameStore.appendGame(game)

    def deleteGame(self, gameTime, deletedBy):
        self._deleteCache()
        return self._gameStore.deleteGame(gameTime, deletedBy)

    def _loadFromStore(self, ladder, ladderTime):
        loadedGames = self._gameStore.getGames()
        if not ladderTime['now']:
            loadedGames = [g for g in loadedGames if ladderTime['range'][0] <= g.time and g.time <= ladderTime['range'][1]]
        for loadedGame in loadedGames:
            ladder.addGame(loadedGame)

    def _loadFromCache(self, ladder):
        if os.path.exists(self._cacheFilePath) and self._usingCache:
            ladder.games = pickle.load(open(self._cacheFilePath, 'rb'))
            for game in [g for g in ladder.games if not g.isDeleted()]:
                red = ladder.getPlayer(game.redPlayer)
                blue = ladder.getPlayer(game.bluePlayer)
                red.game(game)
                blue.game(game)
                red.achieve(game.redAchievements, game)
                blue.achieve(game.blueAchievements, game)
            return True
        return False

    def _writeToCache(self, ladder):
        if self._usingCache:
            pickle.dump(ladder.games, open(self._cacheFilePath, 'wb'), pickle.HIGHEST_PROTOCOL)

    def _deleteCache(self):
        if os.path.exists(self._cacheFilePath) and self._usingCache:
            os.remove(self._cacheFilePath)
