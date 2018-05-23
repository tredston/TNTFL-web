import argparse
import sys
import unittest

import tntfl.test.test_achievements as test_achievements
import tntfl.test.test_game_store as test_game_store
import tntfl.test.test_json as test_json
import tntfl.test.test_ladder as test_ladder
import tntfl.test.test_pundit as test_pundit
import tntfl.test.transforms.test_achievement as test_achievement
import tntfl.test.transforms.test_belt as test_belt
import tntfl.test.transforms.test_elo as test_elo
import tntfl.test.transforms.test_rank as test_rank
from tntfl.test.blueprints import test_entry
from tntfl.test.blueprints import test_game_api
from tntfl.test.blueprints import test_ladder_api
from tntfl.test.blueprints import test_pages
from tntfl.test.blueprints import test_player_api


def unitTestSuite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_achievements))
    test_suite.addTest(unittest.findTestCases(test_game_store))
    test_suite.addTest(unittest.findTestCases(test_ladder))
    test_suite.addTest(unittest.findTestCases(test_pundit))
    test_suite.addTest(unittest.findTestCases(test_json))
    test_suite.addTest(unittest.findTestCases(test_achievement))
    test_suite.addTest(unittest.findTestCases(test_belt))
    test_suite.addTest(unittest.findTestCases(test_elo))
    test_suite.addTest(unittest.findTestCases(test_rank))
    return test_suite


def functionalTestSuite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.findTestCases(test_entry))
    test_suite.addTest(unittest.findTestCases(test_game_api))
    test_suite.addTest(unittest.findTestCases(test_ladder_api))
    test_suite.addTest(unittest.findTestCases(test_pages))
    test_suite.addTest(unittest.findTestCases(test_player_api))
    return test_suite


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--integration', dest='runIntegration', action='store_true')
    parser.set_defaults(runIntegration=False)
    args = parser.parse_args()

    runner = unittest.TextTestRunner()

    print('Running unit tests:')
    result = runner.run(unitTestSuite())

    if len(result.errors) == 0 and len(result.failures) == 0:
        print('Running functional tests:')
        result = runner.run(functionalTestSuite())

    ok = len(result.errors) == 0 and len(result.failures) == 0
    sys.exit(not ok)
