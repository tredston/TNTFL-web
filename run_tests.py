import os
import unittest

import tntfl.test.test_achievements as test_achievements
import tntfl.test.test_game_store as test_game_store
import tntfl.test.test_ladder as test_ladder
import tntfl.test.test_pundit as test_pundit

import tntfl.test.test_deployment as test_deployment


def unit_test_suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_achievements))
    test_suite.addTest(unittest.findTestCases(test_game_store))
    test_suite.addTest(unittest.findTestCases(test_ladder))
    test_suite.addTest(unittest.findTestCases(test_pundit))
    return test_suite


def integration_test_suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_deployment))
    return test_suite

print 'Clearing cache'
cacheFile = 'cache'
if os.path.exists(cacheFile):
    os.remove(cacheFile)

print 'Running unit tests:'
runner = unittest.TextTestRunner()
result = runner.run(unit_test_suite())

if len(result.errors) == 0 and len(result.failures) == 0:
    print 'Running integration tests:'
    runner.run(integration_test_suite())
