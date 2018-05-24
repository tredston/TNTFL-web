import os

from flask import send_from_directory, Blueprint

pages = Blueprint('pages', __name__)


def get_template(templatename):
    template = os.path.join('dist', templatename)
    if os.path.exists(template):
        with open(template, 'r') as fh:
            return fh.read()
    else:
        raise Exception('Missing HTML: %s' % template)


@pages.route('/dist/<path:path>')
def dist(path):
    return send_from_directory('dist', path)


@pages.route('/')
def indexPage():
    return get_template("index.html")


@pages.route('/game/<int:game_time>')
def gamePage(game_time):
    return get_template("game.html")


@pages.route('/game/<int:game_time>/delete')
def deletePage(game_time):
    return get_template("delete.html")


@pages.route('/player/<player>')
def playerPage(player):
    return get_template('player.html')


@pages.route('/player/<player>/games')
def playerGamesPage(player):
    return get_template('playergames.html')


@pages.route('/headtohead/<player1>/<player2>')
def headToHeadPage(player1, player2):
    return get_template('headtohead.html')


@pages.route('/headtohead/<player1>/<player2>/games')
def headToHeadGamesPage(player1, player2):
    return get_template('headtoheadgames.html')


@pages.route('/stats/')
def statsPage():
    return get_template('stats.html')


@pages.route('/speculate/')
def speculatePage():
    return get_template('speculate.html')


@pages.route('/historic/')
def historicPage():
    return get_template('historic.html')


@pages.route('/api/')
def apiPage():
    return get_template('api.html')
