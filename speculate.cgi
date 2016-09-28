#!/usr/bin/env python

import cgi
from time import time
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.game import Game
from tntfl.web import serve_template


def deserialise(serialisedGames):
    gameParts = serialisedGames.split(',')
    games = []
    for i in range(0, len(gameParts) / 4):
        g = Game(gameParts[4 * i], gameParts[4 * i + 1], gameParts[4 * i + 3], gameParts[4 * i + 2], time())
        games.append(g)
        ladder.addGame(g)
    return games

form = cgi.FieldStorage()
ladder = TableFootballLadder(Constants.ladderFilePath)
serialisedSpecGames = form.getfirst('previousGames', '')
games = deserialise(serialisedSpecGames)

redPlayer = form.getfirst('redPlayer')
bluePlayer = form.getfirst('bluePlayer')
redScore = form.getfirst('redScore')
blueScore = form.getfirst('blueScore')
if redPlayer and bluePlayer and redScore and blueScore:
    g = Game(redPlayer, redScore, bluePlayer, blueScore, time())
    games.append(g)
    ladder.addGame(g)
    serialisedSpecGames += ",{0},{1},{2},{3}".format(redPlayer, redScore, blueScore, bluePlayer)
serialisedSpecGames.strip(',')

games.reverse()
serve_template("speculate.mako", ladder=ladder, games=games, serialisedSpecGames=serialisedSpecGames)
