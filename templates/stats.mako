<%!
title = "Stats | "
base = "../"
from collections import OrderedDict
from datetime import date, datetime
from tntfl.game import Game
from tntfl.player import Player
from tntfl.achievements import Achievement

def totimestamp(dt, epoch=datetime(1970,1,1)):
    td = dt - epoch
    return int(td.microseconds + (td.seconds + td.days * 24 * 3600) * 10**6) / 1e6

def getGamesPerDay(ladder):
    gamesPerDay = OrderedDict()
    for game in ladder.games:
        day = datetime.fromtimestamp(game.time).replace(hour=0, minute=0, second=0, microsecond=0)
        if day not in gamesPerDay:
          gamesPerDay[day] = 0
        gamesPerDay[day] += 1
    plotData = []
    for day, tally in gamesPerDay.iteritems():
        plotData.append([totimestamp(day) * 1000, tally])
    return plotData

def getMostSignificantGames(games):
    return sorted([g for g in games if not g.isDeleted()], key=lambda x: abs(x.skillChangeToBlue), reverse=True)
%>
<%inherit file="html.mako" />
<%namespace name="blocks" file="blocks.mako" />

<%def name="stats(ladder)">
    <%
    redGoals = 0
    blueGoals = 0
    for game in ladder.games:
        redGoals += game.redScore
        blueGoals += game.blueScore

    activePlayers = ladder.getNumActivePlayers()
    %>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Stats</h2>
    </div>
    <div class="panel-body">
      <dl class="dl-horizontal">
        <dt>Total games</dt>
        <dd>${len(ladder.games)}</dd>
        <dt>Total goals by red</dt>
        <dd>${redGoals}</dd>
        <dt>Total goals by blue</dt>
        <dd>${blueGoals}</dd>
        <dt>Total players</dt>
        <dd>${len(ladder.players)}</dd>
        <dt>Active players</dt>
        <dd>${activePlayers} (${"{:.2%}".format(float(activePlayers) / len(ladder.players))})</dd>
      </dl>
    </div>
  </div>
</%def>

<%def name="records(ladder)">
    <%
    skillBounds = ladder.getSkillBounds()
    streaks = ladder.getStreaks()
    %>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Records</h2>
    </div>
    <div class="panel-body">
      <dl class="dl-horizontal">
        <dt>Highest ever skill</dt>
        <dd><b>${"{:.3f}".format(skillBounds['highest']['skill'])}</b> (<a href="${self.attr.base}player/${skillBounds['highest']['player'].name}">${skillBounds['highest']['player'].name}</a>, ${self.blocks.render("components/gameLink", time=skillBounds['highest']['time'], base=self.attr.base)})</dd>
        <dt>Lowest ever skill</dt>
        <dd><b>${"{:.3f}".format(skillBounds['lowest']['skill'])}</b> (<a href="${self.attr.base}player/${skillBounds['lowest']['player'].name}">${skillBounds['lowest']['player'].name}</a>, ${self.blocks.render("components/gameLink", time=skillBounds['lowest']['time'], base=self.attr.base)})</dd>
        <dt>Longest winning streak</dt>
        <dd><b>${streaks['win']['streak'].count}</b> (<a href="${self.attr.base}player/${streaks['win']['player'].name}">${streaks['win']['player'].name}</a>)</dd>
        <dt>Longest losing streak</dt>
        <dd><b>${streaks['lose']['streak'].count}</b> (<a href="${self.attr.base}player/${streaks['lose']['player'].name}">${streaks['lose']['player'].name}</a>)</dd>
      </dl>
    </div>
  </div>
</%def>

<%def name="gameList(title, games)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">${title}</h2>
    </div>
    <div class="panel-body">
      ${self.blocks.render("components/gameList", ladder=ladder, games=games, base=self.attr.base)}
    </div>
  </div>
</%def>

<%def name="gamesPerDay(ladder)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Games Per Day</h2>
    </div>
    <div class="panel-body">
      <div id="gamesPerDay">&nbsp;</div>
      <script type="text/javascript">
        plotGamesPerDay("#gamesPerDay", [ ${getGamesPerDay(ladder)} ]);
      </script>
    </div>
  </div>
</%def>

<%
mostSignificantGames = getMostSignificantGames(ladder.games)
%>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-4">
      ${stats(ladder)}
      ${records(ladder)}
    </div>
    <div class="col-md-4">
      ${gameList('Most Significant Games', mostSignificantGames[0:5])}
    </div>
    <div class="col-md-4">
      ${gameList('Least Significant Games', mostSignificantGames[-5:])}
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
      ${gamesPerDay(ladder)}
    </div>
  </div>
  ${blocks.render("components/achievementList", achievements=sorted(ladder.getAchievements().iteritems(), reverse=True, key=lambda t: t[1]))}
</div>
