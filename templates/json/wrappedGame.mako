<%!
import json
from tntfl.template_utils import gameToJson
base = "../../"
%>
<%inherit file="json.mako" />
${json.dumps(gameToJson(game, base))}
