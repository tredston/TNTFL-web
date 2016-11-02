<%!
import json
from tntfl.template_utils import playerToJson
base = '../'
%>
<%inherit file='json.mako' />
${json.dumps(playerToJson(player, ladder))}
