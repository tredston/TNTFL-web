import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder


class TNTFL(object):
    def __init__(self):
        self._tntfl = None
        self.invalidate()

    def get(self):
        return self._tntfl

    def invalidate(self):
        self._tntfl = TableFootballLadder(Constants.ladderFilePath)


tntfl = TNTFL()
