#!/usr/bin/env python

import cgi
import json
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.caching_game_store import CachingGameStore
from tntfl.pundit import Pundit
import tntfl.transforms.transforms as PresetTransforms
from tntfl.web import redirect_302, fail_400, fail_404, serve_template, getInt, getString


form = cgi.FieldStorage()

gameTime = getInt('game', form)
if gameTime is not None:
    try:
        ladder = TableFootballLadder(Constants.ladderFilePath)
        game = next(g for g in ladder.games if g.time == gameTime)
        red = ladder.getPlayer(game.redPlayer)
        blue = ladder.getPlayer(game.bluePlayer)
        pundit = Pundit()
        redFacts = pundit.getAllForGame(red, game, blue)
        blueFacts = pundit.getAllForGame(blue, game, red)
        facts = redFacts + blueFacts
        print 'Content-Type: application/json'
        print
        print json.dumps(facts)
    except StopIteration:
        fail_404()
else:
    fail_400()
