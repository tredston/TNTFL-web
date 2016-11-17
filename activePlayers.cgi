#!/usr/bin/env python
 
import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
import tntfl.transforms.transforms as PresetTransforms
from tntfl.web import getInt

form = cgi.FieldStorage()


def getTimeRange(form):
    timeRange = None
    toTime = getInt('gamesTo', form)
    if toTime is not None:
        timeRange = (0, toTime)
    return timeRange


ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=getTimeRange(form), transforms=PresetTransforms.transforms_for_ladder())
totalActivePlayers = len([p for p in ladder.players.values() if ladder.isPlayerActive(p)])

print 'Content-Type: application/json'
print
print totalActivePlayers
