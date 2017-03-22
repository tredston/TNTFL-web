#!/usr/bin/env python

import cgi
import json
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


form = cgi.FieldStorage()
base = "../"
timeRange = getTimeRange(form)
showInactive = getInt('showInactive', form, 0)
includePlayers = getInt('players', form, 0)

ladder = TableFootballLadder(Constants.ladderFilePath, timeRange=timeRange, transforms=PresetTransforms.transforms_for_ladder())

printJson(ladderToJson(ladder, base, showInactive, includePlayers))
