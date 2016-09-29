import json
import os
import subprocess
import tntfl.test.shared_get as Get


class Deployment(Get.TestRunner):
    def setUp(self):
        if 'QUERY_STRING' in os.environ:
            del(os.environ['QUERY_STRING'])

    def _getJson(self, page, query=None):
        response = self._get(page, query)
        # Strip content type
        response = ''.join(response.split('\n')[2:])
        self.assertTrue(len(response) > 0)
        return json.loads(response)

    def _page(self, page):
        return os.path.join(os.getcwd(), page)

    def _get(self, page, query):
        self._setQuery(query)
        return subprocess.check_output(['python', self._page(page)])

    def _setQuery(self, query):
        if query is not None:
            os.environ['QUERY_STRING'] = query


class Pages(Deployment, Get.Pages):
    pass


class SpeculatePage(Deployment, Get.SpeculatePage):
    pass


class PageBits(Deployment, Get.PageBits):
    pass


class PlayerApi(Deployment, Get.PlayerApi):
    pass


class HeadToHeadApi(Deployment, Get.HeadToHeadApi):
    pass


class RecentApi(Deployment, Get.RecentApi):
    pass


class LadderApi(Deployment, Get.LadderApi):
    pass


class GameApi(Deployment, Get.GameApi):
    pass


class GamesApi(Deployment):
    pass
