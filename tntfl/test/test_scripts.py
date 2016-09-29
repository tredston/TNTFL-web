import unittest
import json
import os
import subprocess
import tntfl.test.bases as Bases


class Deployment(Bases.TestRunner):
    def setUp(self):
        if 'QUERY_STRING' in os.environ:
            del(os.environ['QUERY_STRING'])

    def _page(self, page):
        return os.path.join(os.getcwd(), page)

    def _getJsonFrom(self, page, query=None):
        self._setQuery(query)
        response = subprocess.check_output(['python', self._page(page)])
        # Strip content type
        response = ''.join(response.split('\n')[2:])
        self.assertTrue(len(response) > 0)
        return json.loads(response)

    def _testPageReachable(self, page, query=None):
        self._setQuery(query)
        command = ['python', self._page(page)]
        response = subprocess.check_output(command)
        self._testResponse(response)

    def _setQuery(self, query):
        if query is not None:
            os.environ['QUERY_STRING'] = query


class Pages(Deployment, Bases.Pages):
    pass


class SpeculatePage(Deployment, Bases.SpeculatePage):
    pass


class PageBits(Deployment, Bases.PageBits):
    pass


class PlayerApi(Deployment, Bases.PlayerApi):
    pass


class HeadToHeadApi(Deployment, Bases.HeadToHeadApi):
    pass


class RecentApi(Deployment, Bases.RecentApi):
    pass


class LadderApi(Deployment, Bases.LadderApi):
    pass


class GameApi(Deployment, Bases.GameApi):
    pass


class GamesApi(Deployment):
    pass
