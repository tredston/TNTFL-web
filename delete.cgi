#!/usr/bin/env python3

import cgi
import os
import time

from tntfl.constants import config
from tntfl.game_store import GameStore
from tntfl.hooks.deleteGame import do
from tntfl.hooks.utils import runHooks
from tntfl.web import fail_404, getInt, fail_400, redirect_302, no_content_204


def deleteGame(gameTime, deletedBy, deletedAt):
    games = GameStore(config.ladderFilePath).getGames()
    found = False
    for game in games:
        if game.time == gameTime:
            game.deletedAt = deletedAt
            game.deletedBy = deletedBy
            found = True
            break
    if found:
        with open(config.ladder_file, 'w') as ladder:
            for game in games:
                toWrite = "\n%s %s %s %s %.0f" % (game.redPlayer, game.redScore, game.bluePlayer, game.blueScore, game.time)
                if game.isDeleted():
                    toWrite += " %s %.0f" % (game.deletedBy, game.deletedAt)
                ladder.write(toWrite)
        runHooks(gameTime, [do])
    return found


form = cgi.FieldStorage()
gameTime = getInt('game', form)
referrer = os.environ.get("HTTP_REFERER")
deletedBy = os.environ.get("REMOTE_USER", "Unknown")
if gameTime is not None:
    deleted = deleteGame(gameTime, deletedBy, int(time.time()))
    if deleted:
        if referrer:
            if referrer.endswith('/delete'):
                referrer = referrer[:-len('/delete')]
            redirect_302(referrer)
        else:
            no_content_204()
    else:
        fail_404()
else:
    fail_400()
