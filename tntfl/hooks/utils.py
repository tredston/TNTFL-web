import requests
import urlparse


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
            }
        ],
        'username': 'ScoreBot',
        'icon_url': urlparse.urljoin(mattermostUrl, '/static/emoji/26bd.png'),
    }
    webhookUrl = urlparse.urljoin(urlparse.urljoin(mattermostUrl, '/hooks/'), apiKey)
    requests.post(webhookUrl, json=message)
