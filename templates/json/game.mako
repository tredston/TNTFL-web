<%page args='base, game'/>
<%!
import json
from tntfl.template_utils import gameToJson
%>
${json.dumps(gameToJson(game, base))}
