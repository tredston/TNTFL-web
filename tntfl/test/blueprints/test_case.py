import abc
import json
import os
import shutil
import unittest

from tntfl.blueprints.common import tntfl


class TestCase(unittest.TestCase, metaclass=abc.ABCMeta):
    @classmethod
    def _backupFilename(cls, filename):
        return '%s.actual' % filename

    @classmethod
    def _backupFile(cls, filename):
        if os.path.exists(filename):
            os.rename(filename, cls._backupFilename(filename))

    @classmethod
    def _restoreFile(cls, filename):
        if os.path.exists(filename):
            os.remove(filename)
        if os.path.exists(cls._backupFilename(filename)):
            os.rename(cls._backupFilename(filename), filename)

    @classmethod
    def setUpClass(cls):
        tntfl.invalidate()
        # cls._backupFile('tntfl.cfg')
        cls._backupFile('ladder.txt')
        shutil.copyfile(os.path.join('tntfl', 'test', 'jrem.ladder'), 'ladder.txt')

    @classmethod
    def tearDownClass(cls):
        cls._restoreFile('ladder.txt')
        # cls._restoreFile('tntfl.cfg')

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
