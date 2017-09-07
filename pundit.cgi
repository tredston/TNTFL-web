#!/usr/bin/env python3

import cgi
import json

import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
from tntfl.ladder import TableFootballLadder
from tntfl.pundit import Pundit
from tntfl.web import fail_400, fail_404, getInt


def getFacts(gameTime, ladder):
    game = next(g for g in ladder.games if g.time == gameTime)
    red = ladder.getPlayer(game.redPlayer)
    blue = ladder.getPlayer(game.bluePlayer)
    pundit = Pundit()
    redFacts = pundit.getAllForGame(red, game, blue)
    blueFacts = pundit.getAllForGame(blue, game, red)
    return redFacts + blueFacts


def add(record, time, cur):
    record[int(time)] = {'facts': cur}


form = cgi.FieldStorage()
times = form.getfirst('at')
ladder = TableFootballLadder(Constants.ladderFilePath, transforms=PresetTransforms.transforms_for_ladder())
try:
    if times is not None:
        punditry = {}
        [add(punditry, time, getFacts(int(time), ladder)) for time in times.split(',')]
        print('Content-Type: application/json')
        print()
        print(json.dumps(punditry))
    else:
        fail_400()
except StopIteration:
    fail_404()
