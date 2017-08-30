#!/usr/bin/env python3

import cgi
import json

import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
from tntfl.ladder import TableFootballLadder
from tntfl.pundit import Pundit
from tntfl.web import fail_400, fail_404, getInt


def getFacts(gameTime):
    try:
        ladder = TableFootballLadder(Constants.ladderFilePath, transforms=PresetTransforms.transforms_for_ladder())
        game = next(g for g in ladder.games if g.time == gameTime)
        red = ladder.getPlayer(game.redPlayer)
        blue = ladder.getPlayer(game.bluePlayer)
        pundit = Pundit()
        redFacts = pundit.getAllForGame(red, game, blue)
        blueFacts = pundit.getAllForGame(blue, game, red)
        return redFacts + blueFacts
    except StopIteration:
        return None


form = cgi.FieldStorage()
gameTime = getInt('game', form)
if gameTime is not None:
    facts = getFacts(gameTime)
    if facts is not None:
        print('Content-Type: application/json')
        print()
        print(json.dumps(facts))
    else:
        fail_404()
else:
    fail_400()
