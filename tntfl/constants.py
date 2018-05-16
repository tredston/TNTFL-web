import configparser
import os


def getConfig():
    config_file = 'tntfl.cfg'
    if os.path.exists(config_file):
        config = configparser.RawConfigParser()
        config.read_file(open(config_file, 'r'))
        return config
    else:
        raise Exception('App config is missing!')


# Number of days inactivity after which players are considered inactive
DAYS_INACTIVE = 42

ladderFilePath = getConfig().get('tntfl', 'ladder_file')
