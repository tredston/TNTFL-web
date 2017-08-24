import pickle
import os
import gc


class TransformWrapper(object):
    def __init__(self, transform, name):
        self._transform = transform
        self._name = name
        self._requestCache = True

    def getName(self):
        return self._name

    def setUseCache(self, useCache):
        self._requestCache = useCache

    def getUseCache(self):
        return self._requestCache

    def getCacheName(self):
        return '.cache.%s' % self._name

    def transform(self, games):
        games = self._transform(games)
        if self.getUseCache():
            with open(self.getCacheName(), 'wb') as f:
                gc.disable()
                pickle.dump(games, f, -1)
                gc.enable()
        return games

    def loadCached(self):
        if self.getUseCache() and os.path.exists(self.getCacheName()):
            with open(self.getCacheName(), 'rb') as f:
                gc.disable()
                cached = pickle.load(f)
                gc.enable()
                return cached
        return None

    def deleteCache(self):
        if self.getUseCache() and os.path.exists(self.getCacheName()):
            os.remove(self.getCacheName())
