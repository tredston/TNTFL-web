import requests
import urllib.parse


def postMattermost(mattermostUrl, apiKey, tntflUrl, game, fields, colour):
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
                'fields': fields,
                'color': colour,
            },
        ],
        'username': 'ScoreBot',
        'icon_url': urllib.parse.urljoin(mattermostUrl, '/static/emoji/26bd.png'),
    }
    webhookUrl = urllib.parse.urljoin(urllib.parse.urljoin(mattermostUrl, '/hooks/'), apiKey)
    requests.post(webhookUrl, json=message)
