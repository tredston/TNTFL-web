import os
import re
import unittest

import tntfl.test.test_achievements as test_achievements
import tntfl.test.test_game_store as test_game_store
import tntfl.test.test_ladder as test_ladder
import tntfl.test.test_pundit as test_pundit
import tntfl.test.test_scripts as test_scripts
import tntfl.test.transforms as transforms

import tntfl.test.test_deployment as test_deployment


def unit_test_suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_achievements))
    test_suite.addTest(unittest.findTestCases(test_game_store))
    test_suite.addTest(unittest.findTestCases(test_ladder))
    test_suite.addTest(unittest.findTestCases(test_pundit))
    test_suite.addTest(unittest.findTestCases(transforms))
    return test_suite


def functional_test_suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_scripts))
    return test_suite


def integration_test_suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_deployment))
    return test_suite

print 'Clearing cache'
cacheFile = '.cache.*'
for f in os.listdir('.'):
    if re.search(cacheFile, f):
        os.remove(f)

runner = unittest.TextTestRunner()

print 'Running unit tests:'
result = runner.run(unit_test_suite())

if len(result.errors) == 0 and len(result.failures) == 0:
    print 'Running functional tests:'
    runner.run(functional_test_suite())

if len(result.errors) == 0 and len(result.failures) == 0:
    print 'Running integration tests:'
    runner.run(integration_test_suite())
