from flask import Flask

from tntfl.blueprints.common import tntfl
from tntfl.blueprints.pages import pages
from tntfl.test.blueprints.test_case import TestCase
from tntfl.test.configured_test_case import ConfiguredTestCase


class PageTests(TestCase, ConfiguredTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        tntfl.invalidate()

    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(pages)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def _testPageReachable(self, page, query=None):
        response = self._get(page, query)
        self.assertEqual(response.status_code, 200)


class Pages(PageTests):
    def testIndexReachable(self):
        self._testPageReachable('/')

    def testApiReachable(self):
        self._testPageReachable('/api/')

    def testGameReachable(self):
        self._testPageReachable('/game/1223308996')

    def testDeleteReachable(self):
        self._testPageReachable('/game/1223308996/delete')

    def testPlayerReachable(self):
        self._testPageReachable('/player/jrem')

    def testPlayerGamesReachable(self):
        self._testPageReachable('/player/jrem/games')

    def testHeadToHeadReachable(self):
        self._testPageReachable('/headtohead/jrem/sam')

    def testHeadToHeadGamesReachable(self):
        self._testPageReachable('/headtohead/jrem/ndt/games')

    def testSpeculateReachable(self):
        self._testPageReachable('/speculate/')

    def testStatsReachable(self):
        self._testPageReachable('/stats/')

    def testHistoric(self):
        self._testPageReachable('/historic/')
