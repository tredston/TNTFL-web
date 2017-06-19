#!/usr/bin/env python3

import cgi
import json
from tntfl.web import getInt
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import gameToJson


def printJson(content):
    print('Content-Type: application/json')
    print()
    print(json.dumps(content))


form = cgi.FieldStorage()
base = "../"
limit = getInt('limit', form, 10)

ladder = TableFootballLadder(Constants.ladderFilePath)
recentGames = [l for l in ladder.games if not l.isDeleted()][-limit:]

printJson([gameToJson(game, base) for game in reversed(recentGames)])
