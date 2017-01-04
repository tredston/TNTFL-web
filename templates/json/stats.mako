<%!
import json
from tntfl.ladder import TableFootballLadder
import tntfl.constants as Constants
import tntfl.transforms.transforms as PresetTransforms
from tntfl.template_utils import getStatsJson
base = "../"
%>
<%inherit file="json.mako" />
<%
ladder = TableFootballLadder(Constants.ladderFilePath)
%>
${json.dumps(getStatsJson(ladder, base))}
