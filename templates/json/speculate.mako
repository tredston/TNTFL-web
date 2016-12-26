<%!
import json
from time import time
from tntfl.ladder import TableFootballLadder
import tntfl.constants as Constants
from tntfl.game_store import GameStore
import tntfl.transforms.transformer as Transformer
import tntfl.transforms.transforms as PresetTransforms
from tntfl.template_utils import ladderToJson, gameToJson
base = "../"
%>
<%inherit file="json.mako" />
<%
transforms = PresetTransforms.transforms_for_recent()
games = Transformer.transform(lambda: GameStore(Constants.ladderFilePath).getGames(), transforms, False)

if len(speculativeGames) > 0:
    games = games + speculativeGames
    games = Transformer.transform(lambda: games, transforms, False)

ladder = TableFootballLadder(None, games=games)

players = ladder.getPlayers() if showInactive else [p for p in ladder.getPlayers() if ladder.isPlayerActive(p)]
speculatedGames = ladder.games[-len(speculativeGames):] if len(speculativeGames) > 0 else []
%>
${json.dumps({
    'entries': ladderToJson(players, ladder, base, includePlayers),
    'games': [gameToJson(game, base) for game in speculatedGames],
})}
