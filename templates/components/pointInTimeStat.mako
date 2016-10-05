<%page args="base, time"/>
<%namespace name="blocks" file="../blocks.mako"/>
${"{:.3f}".format(skill)}
<div class="date">
    % if time > 0:
        at ${blocks.render("components/gameLink", time=time, base=base)}
    % else:
        before first game
    % endif
</div>
