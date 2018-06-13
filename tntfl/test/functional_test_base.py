import os
import shutil
import unittest

from tntfl.blueprints.common import tntfl


class FunctionalTestBase(unittest.TestCase):
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
        cls._backupFile('tntfl.cfg')
        shutil.copyfile(os.path.join('tntfl', 'test', 'tntfl.cfg'), 'tntfl.cfg')

    @classmethod
    def tearDownClass(cls):
        cls._restoreFile('tntfl.cfg')
