import cPickle as pickle
import os


class TransformWrapper(object):
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
