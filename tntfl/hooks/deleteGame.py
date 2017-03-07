import requests
import os
import ConfigParser
import urlparse
import tntfl.constants as Constants
from datetime import datetime, timedelta


def do(game):
    if os.path.exists(Constants.configFile):
        config = ConfigParser.RawConfigParser()
        config.readfp(open(Constants.configFile, 'r'))

        if config.has_option('mattermost', 'mattermost_url') and config.has_option('mattermost', 'delete_api_key') and config.has_option('mattermost', 'tntfl_url'):
            mattermostUrl = config.get('mattermost', 'mattermost_url')
            apiKey = config.get('mattermost', 'delete_api_key')
            tntflUrl = config.get('mattermost', 'tntfl_url')

            webhookUrl = urlparse.urljoin(urlparse.urljoin(mattermostUrl, '/hooks/'), apiKey)
            gameUrl = '{}/game/{}'.format(tntflUrl, game.time)
            title = '{} {}-{} {}'.format(
                game.redPlayer,
                game.redScore,
                game.blueScore,
                game.bluePlayer,
            )

            message = {
                'attachments': [
                    {
                        'pretext': '[{}]({})'.format(title, gameUrl),
                        'color': '#FF0000',
                        'fields': [{
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
                        }],
                    }
                ],
                'username': 'ScoreBot',
                'icon_url': urlparse.urljoin(mattermostUrl, '/static/emoji/26bd.png'),
            }
            requests.post(webhookUrl, json=message)
