import json


class TestCase(object):
    def _getJson(self, page, query=None):
        response = self._get(page, query)
        self.assertEqual(response.status_code, 200)
        return json.loads(response.data.decode('utf-8'))

    def _page(self, url, query=None):
        if query is not None:
            url += '?' + query
        return url

    def _get(self, page, query):
        return self.client.get(self._page(page, query))
