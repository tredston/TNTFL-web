from future import standard_library
standard_library.install_aliases()
from builtins import object
import pickle as pickle
import os
import gc


class TransformWrapper(object):
    def __init__(self, transform, name, enableCache=True):
        self._transform = transform
        self._name = name
        self._enableCache = enableCache
        self._requestCache = enableCache

    def getName(self):
        return self._name

    def setUseCache(self, useCache):
        self._requestCache = useCache

    def getUseCache(self):
        return self._enableCache and self._requestCache

    def getCacheName(self):
        return '.cache.%s' % self._name

    def transform(self, games):
        games = self._transform(games)
        if self.getUseCache():
            with open(self.getCacheName(), 'wb') as f:
                gc.disable()
                pickle.dump(games, f, pickle.HIGHEST_PROTOCOL)
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
