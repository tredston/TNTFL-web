#!/usr/bin/env python3

import cgi
import os
import time

import tntfl.constants as Constants
from tntfl.game_store import GameStore
from tntfl.hooks.deleteGame import do
from tntfl.hooks.utils import runHooks
from tntfl.web import fail_404, getInt, fail_400, redirect_302, getString, no_content_204


def deleteGame(gameTime, deletedBy, deletedAt):
    games = GameStore(Constants.ladderFilePath).getGames()
    found = False
    for game in games:
        if game.time == gameTime:
            game.deletedAt = deletedAt
            game.deletedBy = deletedBy
            found = True
            break
    if found:
        with open(Constants.ladder_file, 'w') as ladder:
            for game in games:
                toWrite = "\n%s %s %s %s %.0f" % (game.redPlayer, game.redScore, game.bluePlayer, game.blueScore, game.time)
                if game.isDeleted():
                    toWrite += " %s %.0f" % (game.deletedBy, game.deletedAt)
                ladder.write(toWrite)
        runHooks(gameTime, [do])
    return found


form = cgi.FieldStorage()

gameTime = getInt('game', form)
redirect = getString('redirect', form)
if gameTime is not None:
    deletedBy = os.environ["REMOTE_USER"] if "REMOTE_USER" in os.environ else "Unknown"
    deleted = deleteGame(gameTime, deletedBy, int(time.time()))
    if deleted:
        if redirect:
            redirect_302(redirect)
        else:
            no_content_204()
    else:
        fail_404()
else:
    fail_400()
