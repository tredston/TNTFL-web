import json
import time

from flask import Flask, request, abort

from tntfl.constants import config
import tntfl.transforms.transformer as Transformer
import tntfl.transforms.transforms as PresetTransforms
from tntfl.blueprints.ladder_api import ladder_api
from tntfl.blueprints.common import tntfl
from tntfl.blueprints.game_api import game_api
from tntfl.blueprints.pages import pages
from tntfl.blueprints.player_api import player_api
from tntfl.game import Game
from tntfl.game_store import GameStore
from tntfl.ladder import TableFootballLadder
from tntfl.pundit import Pundit
import tntfl.transforms.elo as Elo
from tntfl.template_utils import gameToJson, getSharedGames, getStatsJson, getSpeculateJson

app = Flask(__name__)
app.register_blueprint(pages)
app.register_blueprint(ladder_api)
app.register_blueprint(game_api)
app.register_blueprint(player_api)


def parse_times(at):
    return [int(t) for t in at.split(',') if len(t) > 0]


@app.route('/recent/json')
def recent():
    base = "../"
    limit = request.args.get('limit') or 10

    recent_games = [l for l in tntfl.get().games if not l.isDeleted()][-limit:]

    return json.dumps([gameToJson(game, base) for game in reversed(recent_games)])


@app.route('/activeplayers/json')
def activePlayers():
    def add(record, time, cur):
        record[int(time)] = {'count': cur}

    at = request.args.get('at') or ''
    times = parse_times(at)
    active_players = {}
    if len(times) > 0:
        [add(active_players, t, tntfl.get().getNumActivePlayers(t)) for t in times]
    else:
        add(active_players, time.time(), tntfl.get().getNumActivePlayers())

    return json.dumps(active_players)


@app.route('/pundit/json')
def pundit():
    def getFacts(gameTime, ladder):
        game = next(g for g in ladder.games if g.time == gameTime)
        red = ladder.getPlayer(game.redPlayer)
        blue = ladder.getPlayer(game.bluePlayer)
        pundit = Pundit()
        red_facts = pundit.getAllForGame(red, game, blue)
        blue_facts = pundit.getAllForGame(blue, game, red)
        return red_facts + blue_facts

    at = request.args.get('at') or ''
    times = parse_times(at)
    if len(times) > 0:
        try:
            punditry = dict([(t, {"facts": getFacts(t, tntfl.get())}) for t in times])
            return json.dumps(punditry)
        except StopIteration:
            abort(404)
    else:
        abort(400)


@app.route('/games/<int:games_from>/<int:games_to>/json')
def games(games_from, games_to):
    def accept(game, games_from, games_to, include_deleted):
        def within_lower_bound(game, games_from):
            return not games_from or game.time >= games_from

        def within_upper_bound(game, games_to):
            return not games_to or game.time <= games_to

        def include_if_deleted(game, include_deleted):
            return include_deleted or not game.isDeleted()

        return within_lower_bound(game, games_from) and within_upper_bound(game, games_to) and include_if_deleted(game, include_deleted)

    def filter_games(games, games_from, games_to, include_deleted):
        return [g for g in games if accept(g, games_from, games_to, include_deleted)]

    def limit_games(games, limit):
        if limit:
            games = games[-int(limit):]
        return games

    limit = request.args.get('limit')
    include_deleted = request.args.get('includeDeleted')
    if include_deleted:
        include_deleted = int(include_deleted)

    base = ''
    games = tntfl.get().games
    games = filter_games(games, games_from, games_to, include_deleted)
    games = limit_games(games, limit)

    return json.dumps([gameToJson(game, base) for game in games])


@app.route('/headtohead/<player1>/<player2>/games/json')
def headToHeadGames(player1, player2):
    base = '../../../../'

    if player1 in tntfl.get().players and player2 in tntfl.get().players:
        player1 = tntfl.get().getPlayer(player1)
        player2 = tntfl.get().getPlayer(player2)
        games = getSharedGames(player1, player2)
        return json.dumps([gameToJson(game, base) for game in games])
    else:
        abort(404)


@app.route('/predict/<red_elo>/<blue_elo>/json')
def predict(red_elo, blue_elo):
    return json.dumps({'blueGoalRatio': Elo.getBlueGoalRatio(float(red_elo), float(blue_elo))})


@app.route('/stats/json')
def stats():
    base = '../'
    return json.dumps(getStatsJson(tntfl.get(), base))


@app.route('/speculate/json')
def speculate():
    def deserialise(serialisedGames):
        game_parts = serialisedGames.split(',')
        games = []
        now = time.time()
        num_games = len(game_parts) // 4
        for i in range(0, num_games):
            g = Game(game_parts[4 * i].lower(), game_parts[4 * i + 1], game_parts[4 * i + 3].lower(), game_parts[4 * i + 2], now - (num_games - i))
            games.append(g)
        return games

    def getLadder(speculative_games):
        transforms = PresetTransforms.transforms_for_recent()
        games = Transformer.transform(lambda: GameStore(config.ladderFilePath).getGames(), transforms)

        if len(speculative_games) > 0:
            games += speculative_games
            games = Transformer.transform(lambda: games, transforms)

        return TableFootballLadder(None, games=games)

    def get_speculated_games(ladder, speculative_games):
        num_games = len(speculative_games)
        return ladder.games[-num_games:] if num_games > 0 else []

    base = '../'
    show_inactive = request.args.get('showInactive')
    include_players = request.args.get('players')

    speculative_games = deserialise(request.args.get('previousGames') or '')

    ladder = getLadder(speculative_games)
    speculated_games = get_speculated_games(ladder, speculative_games)

    return json.dumps(getSpeculateJson(ladder, base, speculated_games, show_inactive, include_players))
