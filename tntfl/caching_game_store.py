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


class CachingGameStore(object):
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

        games = self._transform(eloTransform.do, games, ladderTime['now'], '.cache.elo')
        games = self._transform(rankTransform.do, games, ladderTime['now'], '.cache.rank')
        if ladderTime['now']:
            games = self._transform(achievementTransform.do, games, ladderTime['now'], self._cacheFilePath)
        self._loadGamesIntoLadder(games, ladder)

    def _transform(self, transform, games, cache, cacheName):
        games = transform(games)
        if cache and self._usingCache:
            pickle.dump(games, open(cacheName, 'wb'), pickle.HIGHEST_PROTOCOL)
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
