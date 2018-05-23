import tntfl.constants as Constants
from tntfl.hooks.utils import postMattermost


def skillField(playerName, skillChange):
    field = None
    if skillChange > 0:
        field = {
            'title': "{}'s skill".format(playerName),
            'value': '{:+.3f}'.format(skillChange),
            'short': True,
        }
    return field


def rankChangeField(playerName, posChange, posAfter):
    field = None
    if posChange != 0:
        field = {
            'title': "{}'s rank".format(playerName),
            'value': '{:+d} ({:d})'.format(posChange, posAfter),
            'short': True,
        }
    return field


def flawlessVictory(game):
    return (game.redScore is 10 and game.blueScore is 0) or (game.blueScore is 10 and game.redScore is 0)


def victoryColour(game):
    if (flawlessVictory(game)):
        return '#FFFF00'
    if (game.redScore is game.blueScore):
        return '#FF00FF'
    if (game.redScore > game.blueScore):
        return '#FF0000'
    return '#0000FF'


def do(game):
    config = Constants.config
    if config.has_option('mattermost', 'mattermost_url') and config.has_option('mattermost', 'api_key') and config.has_option('mattermost', 'tntfl_url'):
        mattermostUrl = config.get('mattermost', 'mattermost_url')
        apiKey = config.get('mattermost', 'api_key')
        tntflUrl = config.get('mattermost', 'tntfl_url')
        fields = [f for f in [
            skillField(game.bluePlayer, game.skillChangeToBlue),
            skillField(game.redPlayer, -game.skillChangeToBlue),
            rankChangeField(game.bluePlayer, game.bluePosChange, game.bluePosAfter),
            rankChangeField(game.redPlayer, game.redPosChange, game.redPosAfter),
        ] if f is not None]
        colour = victoryColour(game)

        postMattermost(mattermostUrl, apiKey, tntflUrl, game, fields, colour)
