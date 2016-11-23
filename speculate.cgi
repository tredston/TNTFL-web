#!/usr/bin/env python

import cgi
from time import time
import tntfl.constants as Constants
from tntfl.ladder import TableFootballLadder
from tntfl.game import Game
from tntfl.game_store import GameStore
import tntfl.transforms.transformer as Transformer
import tntfl.transforms.transforms as PresetTransforms
from tntfl.web import serve_template, getString, getInt


def deserialise(serialisedGames):
    gameParts = serialisedGames.split(',')
    games = []
    for i in range(0, len(gameParts) / 4):
        g = Game(gameParts[4 * i], gameParts[4 * i + 1], gameParts[4 * i + 3], gameParts[4 * i + 2], time())
        games.append(g)
    return games


def baseGameLoader():
    return GameStore(Constants.ladderFilePath).getGames()


def loadLadderGames():
    transforms = PresetTransforms.transforms_for_recent()
    return Transformer.transform(baseGameLoader, transforms, False)


def getAddedGame(form):
    game = None
    redPlayer = getString('redPlayer', form)
    bluePlayer = getString('bluePlayer', form)
    redScore = getInt('redScore', form)
    blueScore = getInt('blueScore', form)
    if redPlayer is not None and bluePlayer is not None and redScore is not None and blueScore is not None:
        game = Game(redPlayer, redScore, bluePlayer, blueScore, time())
    return game


form = cgi.FieldStorage()
games = loadLadderGames()
speculativeGames = deserialise(form.getfirst('previousGames', ''))
game = getAddedGame(form)
if game:
    speculativeGames.append(game)
    games.append(game)
    games = Transformer.transform(lambda: games, PresetTransforms.transforms_for_recent(), False)

speculativeladder = TableFootballLadder(Constants.ladderFilePath, games=games)
serve_template("speculate.mako", ladder=speculativeladder, speculativeGames=speculativeGames)
