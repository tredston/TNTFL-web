from tntfl.constants import config
from tntfl.ladder import TableFootballLadder


class TNTFL(object):
    def __init__(self):
        self._tntfl = None

    def get(self):
        if self._tntfl is None:
            self._tntfl = TableFootballLadder(config.ladderFilePath)
        return self._tntfl

    def invalidate(self):
        self._tntfl = None


tntfl = TNTFL()
