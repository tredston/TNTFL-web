import cPickle as pickle
import os


class TransformWrapper(object):
    def __init__(self, transform, name, enableCache=True):
        self._transform = transform
        self._name = name
        self._enableCache = enableCache
        self._requestCache = enableCache

    def setUseCache(self, useCache):
        self._requestCache = useCache

    def getUseCache(self):
        return self._enableCache and self._requestCache

    def getCacheName(self):
        return '.cache.%s' % self._name

    def transform(self, games):
        games = self._transform(games)
        if self.getUseCache():
            pickle.dump(games, open(self.getCacheName(), 'wb'), pickle.HIGHEST_PROTOCOL)
        return games

    def loadCached(self):
        if self.getUseCache() and os.path.exists(self.getCacheName()):
            return pickle.load(open(self.getCacheName(), 'rb'))
        return None

    def deleteCache(self):
        if self.getUseCache() and os.path.exists(self.getCacheName()):
            os.remove(self.getCacheName())
