import configparser
import os
from urllib.parse import urljoin


def getConfig(config_file):
    if os.path.exists(config_file):
        config = configparser.RawConfigParser()
        config.read_file(open(config_file, 'r'))
        return config
    else:
        raise Exception('App config is missing!')


# Number of days inactivity after which players are considered inactive
DAYS_INACTIVE = 42

config = getConfig('tntfl.cfg')

ladder_host = config.get('tntfl', 'ladder_host')
ladder_file = config.get('tntfl', 'ladder_file')
if ladder_host[-1] is not '/':
    raise Exception('ladder_host must have a trailing slash!')
ladderFilePath = urljoin(ladder_host, ladder_file)
