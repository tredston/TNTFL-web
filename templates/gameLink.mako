<%page args="time, base"/>
<%!
import tntfl.template_utils as utils
%>
<a href="${base}game/${time}/">
  ${utils.formatTime(time)}
</a>
