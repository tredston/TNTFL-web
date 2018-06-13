import configparser
import os
from urllib.parse import urljoin

# Number of days inactivity after which players are considered inactive
DAYS_INACTIVE = 42


class Configuration(object):
    def __init__(self, config_file):
        self.configuration = None
        self.config_file = config_file

    def init(self):
        if not self.configuration:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as fp:
                    config = configparser.RawConfigParser()
                    config.read_file(fp)
                    self.configuration = config
            else:
                raise Exception('App config is missing!')

    def reset(self):
        self.configuration = None

    @property
    def ladder_host(self):
        return self.get('tntfl', 'ladder_host')

    @property
    def ladder_file(self):
        return self.get('tntfl', 'ladder_file')

    @property
    def ladderFilePath(self):
        if self.ladder_host[-1] is not '/':
            raise Exception('ladder_host must have a trailing slash!')
        return urljoin(self.ladder_host, self.ladder_file)

    def get(self, section, option):
        self.init()
        return self.configuration.get(section, option)

    def has_option(self, section, option):
        self.init()
        return self.configuration.has_option(section, option)


config = Configuration('tntfl.cfg')
