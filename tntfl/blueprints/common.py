import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.transforms.transforms import Transforms


class TNTFL(object):
    def __init__(self):
        self._tntfl = None
        self.invalidate()

    def get(self):
        return self._tntfl

    def invalidate(self):
        for transform in list(Transforms.values()):
            transform.deleteCache()
        self._tntfl = TableFootballLadder(Constants.ladderFilePath)


tntfl = TNTFL()
