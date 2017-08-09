#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.template_utils import gameToJson
from tntfl.web import serve_template, getInt


def accept(game, fromTime, toTime, includeDeleted):
    return (not fromTime or game.time >= fromTime) and (not toTime or game.time <= toTime) and (includeDeleted or not game.isDeleted())


form = cgi.FieldStorage()
ladder = TableFootballLadder(Constants.ladderFilePath)
fromTime = getInt('from', form)
toTime = getInt('to', form)
limit = getInt('limit', form)
includeDeleted = getInt('includeDeleted', form, 0)
games = [g for g in ladder.games if accept(g, fromTime, toTime, includeDeleted)]

if limit:
    games = games[-limit:]

base = ''

serve_template("games.mako", lambda: [gameToJson(game, base) for game in games])
