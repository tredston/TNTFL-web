<%!
import json
from tntfl.template_utils import playertoJson
base = '../'
%>
<%inherit file='json.mako' />
${json.dumps(playertoJson(player, ladder))}
