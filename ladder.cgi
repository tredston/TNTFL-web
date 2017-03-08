#!/usr/bin/env python

import cgi
import json
import os
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import ladderToJson
import tntfl.transforms.transforms as PresetTransforms
from tntfl.web import getInt


def getTimeRange(form):
    timeRange = None
    fromTime = getInt('gamesFrom', form)
    toTime = getInt('gamesTo', form)
    if fromTime is not None and toTime is not None:
        timeRange = (fromTime, toTime)
    return timeRange


def printJson(content):
    print 'Content-Type: application/json'
    print
    print json.dumps(content)


def getPlayers(ladder, showInactive):
    return ladder.getPlayers() if showInactive else [p for p in ladder.getPlayers() if ladder.isPlayerActive(p)]

form = cgi.FieldStorage()
base = "../"
timeRange = getTimeRange(form)
showInactive = getInt('showInactive', form, 0)
includePlayers = getInt('players', form, 0)

ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=timeRange, transforms=PresetTransforms.transforms_for_ladder())
players = getPlayers(ladder, showInactive)

printJson(ladderToJson(players, ladder, base, includePlayers))
