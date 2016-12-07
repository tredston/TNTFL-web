<%!
import json
import tntfl.template_utils as utils
%>
<%inherit file='json.mako' />
${json.dumps(utils.perPlayerStatsToJson(utils.getPerPlayerStats(player)))}
