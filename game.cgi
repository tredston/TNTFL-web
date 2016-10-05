#!/usr/bin/env python

import cgi
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
import tntfl.transforms.transforms as PresetTransforms
from tntfl.web import redirect_302, fail_404, serve_template, getInt, getString

form = cgi.FieldStorage()

ladder = TableFootballLadder(Constants.ladderFilePath)
if getString('method', form) == "add":
    redPlayer = getString('redPlayer', form)
    bluePlayer = getString('bluePlayer', form)
    redScore = getInt('redScore', form)
    blueScore = getInt('blueScore', form)
    if redPlayer and bluePlayer and redScore and blueScore:
        ladder.appendGame(redPlayer, redScore, bluePlayer, blueScore)
        # Invalidated, regenerate
        # Tablet doesn't display achievements
        ladder = TableFootballLadder(Constants.ladderFilePath, transforms=PresetTransforms.transforms_for_recent())
        game = ladder.games[-1]
        if getString('view', form) == 'json':
            serve_template("game.mako", game=game, ladder=ladder)
        else:
            redirect_302("../%.0f" % game.time)
elif getString('method', form) == 'view':
    gameTime = getInt('game', form)
    if gameTime is not None:
        try:
            game = next(g for g in ladder.games if g.time == gameTime)
            serve_template("game.mako", game=game, ladder=ladder)
        except StopIteration:
            fail_404()
