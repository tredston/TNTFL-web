
from builtins import str
from datetime import datetime, timedelta

from tntfl.constants import config
from tntfl.hooks.utils import postMattermost


def do(game):
    if config.has_option('mattermost', 'mattermost_url') and config.has_option('mattermost', 'delete_api_key') and config.has_option('mattermost', 'tntfl_url'):
        mattermostUrl = config.get('mattermost', 'mattermost_url')
        apiKey = config.get('mattermost', 'delete_api_key')
        tntflUrl = config.get('mattermost', 'tntfl_url')
        fields = [{
            'title': 'Deleted',
            'value': 'By {} at {}'.format(
                game.deletedBy,
                datetime.fromtimestamp(game.deletedAt).isoformat(),
            ),
            'short': True,
        }, {
            'title': 'Lag',
            'value': '{}'.format(str(timedelta(seconds=(game.deletedAt - game.time)))),
            'short': True,
        }]

        postMattermost(mattermostUrl, apiKey, tntflUrl, game, fields, '#FF0000')
