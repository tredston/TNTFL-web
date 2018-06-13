#!/usr/bin/env python3

import cgi
import time

from tntfl.constants import config
from tntfl.game import Game
from tntfl.hooks.addGame import do
from tntfl.hooks.utils import runHooks
from tntfl.web import fail_400, getInt, getString, no_content_204


def appendGame(game):
    with open(config.ladder_file, 'a') as ladder:
        ladder.write("\n%s %s %s %s %.0f" % (game.redPlayer, game.redScore, game.bluePlayer, game.blueScore, game.time))
    runHooks(game.time, [do])
    return game.time


form = cgi.FieldStorage()
redPlayer = getString('redPlayer', form)
bluePlayer = getString('bluePlayer', form)
redScore = getInt('redScore', form)
blueScore = getInt('blueScore', form)
if redPlayer is not None and bluePlayer is not None and redScore is not None and blueScore is not None and redPlayer != bluePlayer:
    redScore = int(redScore)
    blueScore = int(blueScore)
    if redScore >= 0 and blueScore >= 0 and (redScore + blueScore) > 0:
        appendGame(Game(redPlayer.lower(), redScore, bluePlayer.lower(), blueScore, int(time.time())))
        no_content_204()
    else:
        fail_400()
else:
    fail_400()
