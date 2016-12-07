<%!
import json
import tntfl.template_utils as utils
%>
<%inherit file='json.mako' />
${json.dumps(utils.getPlayerAchievementsJson(player))}
