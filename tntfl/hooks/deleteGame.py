from future import standard_library
standard_library.install_aliases()
from builtins import str
import configparser
from datetime import datetime, timedelta
import os
import tntfl.constants as Constants
from tntfl.hooks.utils import postMattermost


def do(game):
    if os.path.exists(Constants.configFile):
        config = configparser.RawConfigParser()
        config.readfp(open(Constants.configFile, 'r'))

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
