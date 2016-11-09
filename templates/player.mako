<%!
title = ""
base = "../../"
from tntfl.game import Game
from tntfl.web import get_template
from tntfl.pundit import Pundit
import tntfl.template_utils as utils

def getSkillHistory(player):
    skill = 0
    skillHistory = []
    for game in player.games:
        if game.redPlayer == player.name:
            skill -= game.skillChangeToBlue
            skillHistory.append([game.time * 1000, skill])
        elif game.bluePlayer == player.name:
            skill += game.skillChangeToBlue
            skillHistory.append([game.time * 1000, skill])
    return skillHistory
%>
<%inherit file="html.mako" />
<%
pundit = Pundit()

streaks = player.getStreaks()
winStreak = streaks['win']
loseStreak = streaks['lose']
currentStreak = streaks['current']
currentStreakType = streaks['currentType']

overratedClass = "positive" if player.overrated() <= 0 else "negative"
tenNilWins = utils.getNumYellowStripes(player, player.games)
pps = utils.getPerPlayerStats(player)
rank = ladder.getPlayerRank(player.name)
redness = float(player.gamesAsRed) / len(player.games) if len(player.games) > 0 else 0
sideStyle = "background-color: rgb(" + str(int(round(redness * 255))) + ", 0, "  + str(int(round((1 - redness) * 255))) + ")"
goalRatio = (float(player.goalsFor) / player.goalsAgainst) if player.goalsAgainst > 0 else 0
goalRatioClass = "positive" if goalRatio > 1 else "negative" if goalRatio < 1 else ""
skillBounds = player.getSkillBounds()
skillChange = player.skillChangeToday()
skillChangeClass = "positive" if skillChange > 0 else "negative" if skillChange < 0 else ""
rankChange = player.rankChangeToday()
rankChangeClass = "positive" if rankChange > 0 else "negative" if rankChange < 0 else ""
%>

<%def name="statBox(title, body, classes='', style='', offset=0, width=3, caption='')">
  <div class="col-sm-${width} col-md-offset-${offset * width}">
    <div class="panel panel-default panel-statbox" title="${caption}">
      <div class="panel-heading">
        <h3 class="statbox">${title}</h3>
      </div>
      <div class="panel-body ${classes}" style="${style}">
        ${body}
      </div>
    </div>
  </div>
</%def>

<%def name="achievementStat(ach, games)">
  <div class="col-sm-3">
    <div class="panel panel-default panel-statbox panel-achievement" title="${ach.description}">
      <div class="panel-heading">
        <h3 class="statbox">${ach.name}</h3>
      </div>
      <div class="panel-body achievement-${ach.__name__}">
        ${len(games)}
        <img src="${base}img/arrow-down.png"
          id="achievement-${ach.__name__}-arrow"
          onclick="togglecollapse('achievement-${ach.__name__}', '${base}')"
        />
        <ul class="list-unstyled achievement-games" id="achievement-${ach.__name__}-collapse">
          %for game in games:
            <li>
              ${self.blocks.render("components/gameLink", time=game.time, base=base)}
            </li>
          %endfor
        </ul>
      </div>
    </div>
  </div>
</%def>

<%def name="skillChart(player)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Skill Chart</h2>
    </div>
    <div class="panel-body">
      <div id="playerchart">&nbsp;</div>
      <script type="text/javascript">
        plotPlayerSkill("#playerchart", [ ${getSkillHistory(player)} ]);
      </script>
    </div>
  </div>
</%def>

<%def name="perPlayerStat(player, stat)">
    <%
    goalRatio = (float(stat.goalsFor)/stat.goalsAgainst) if stat.goalsAgainst > 0 else 0
    %>
  <tr>
    <td class="ladder-name"><a href="${base}player/${stat.opponent}">${stat.opponent}</a></td>
    <td><a href="${base}headtohead/${player.name}/${stat.opponent}/" title="Head to Head"><span class="glyphicon glyphicon-transfer"></span></a></td>
    <td class="ladder-stat">${stat.games}</td>
    <td class="ladder-stat">${stat.wins}</td>
    <td class="ladder-stat">${stat.draws}</td>
    <td class="ladder-stat">${stat.losses}</td>
    <td class="ladder-stat">${stat.goalsFor}</td>
    <td class="ladder-stat">${stat.goalsAgainst}</td>
    <td class="ladder-stat">${"{:.3f}".format(goalRatio)}</td>
    <td class="ladder-stat ladder-skill">${"{:+.3f}".format(stat.skillChange)}</td>
  </tr>
</%def>

<%def name="perPlayerStats(player)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Per-Player Stats</h2>
    </div>
    <div class="panel-body">
      <table class="table table-striped table-hover ladder" id="pps">
        <thead>
          <tr>
            <th>Opponent</th>
            <th></th>
            <th>Games</th>
            <th>Wins</th>
            <th>Draws</th>
            <th>Losses</th>
            <th>Goals scored</th>
            <th>Goals conceded</th>
            <th>Goal Ratio</th>
            <th>Skill change</th>
          </tr>
        </thead>
        <tbody>
          % for stat in pps.values():
            ${perPlayerStat(player, stat)}
          % endfor
        </tbody>
      </table>
      <script type="text/javascript">
        $("#pps").tablesorter({sortList:[[9,1]], 'headers': { 1: { 'sorter': false}}});
      </script>
    </div>
  </div>
</%def>

<%def name="recentGames(player)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Recent Games</h2>
    </div>
    <div class="panel-body">
      ${self.blocks.render("recent", base=self.attr.base, ladder=ladder, games=player.games, limit=5)}
      <a class="pull-right" href="games/">See all games</a>
    </div>
  </div>
</%def>

<%def name="gamePanel(title, game)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">${title}</h2>
    </div>
    <div class="panel-body">
      <div class="game table-responsive container-fluid">
        <table class="table no-table-boder" style="margin-top: 20px;">
          <tbody>
            ${self.blocks.render("components/game", game=game, base=self.attr.base, punditryAvailable=utils.punditryAvailable(pundit, game, ladder), totalActivePlayers=ladder.getNumActivePlayers(game.time-1))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</%def>

<%def name="achievements(player)">
  <div class="panel panel-default">
    <a id="achievements"></a>
    <div class="panel-heading">
      <h2 class="panel-title">Achievements</h2>
    </div>
    <div class="panel-body">
      <div class="row">
        % for ach, games in player.achievements.iteritems():
          % if loop.index % 4 == 0:
            </div><div class="row">
          % endif
          ${achievementStat(ach, list(reversed(games)))}
        % endfor
      </div>
    </div>
  </div>
</%def>

<div class="container-fluid">
  <div class="row">
    <div class="col-md-8">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h1 class="panel-title">${player.name}</h1>
        </div>
        <div class="panel-body">
          <div class="row">
            ${statBox(title="Current Ranking", body=(rank if rank != -1 else "-"), classes=utils.getRankCSS(rank, ladder.getNumActivePlayers()))}
            ${statBox(title="Skill", body="{:.3f}".format(player.elo))}
            ${statBox(title="Overrated", body="{:.3f}".format(player.overrated()), classes=overratedClass)}
            ${statBox(title="Side preference", body="{:.2%}".format(redness if redness >= 0.5 else (1-redness)) + (" red" if redness >= 0.5 else " blue"), classes="side-preference", style=sideStyle)}
          </div>
          <div class="row">
            ${statBox(title="Total games", body=len(player.games))}
            ${statBox(title="Wins", body=player.wins)}
            ${statBox(title="Losses", body=player.losses)}
            ${statBox(title="Draws", body=(len(player.games) - player.wins - player.losses))}
          </div>
          <div class="row">
            ${statBox(title="Goals for", body=player.goalsFor)}
            ${statBox(title="Goals against", body=player.goalsAgainst)}
            ${statBox(title="Goal ratio", body=("{:.3f}".format(goalRatio)), classes=goalRatioClass)}
            ${statBox(title="10-0 wins", body=tenNilWins)}
          </div>
          <div class="row">
            ${statBox(title="Games today", body=player.gamesToday)}
            ${statBox(title="Skill change today", body="{:.3f}".format(skillChange), classes=skillChangeClass)}
            ${statBox(title="Rank change today", body=rankChange, classes=rankChangeClass)}
            ${statBox(title="Current streak", body=get_template("components/durationStat.mako", value="{0} {1}".format(currentStreak.count, currentStreakType), fromDate=currentStreak.fromDate, toDate=currentStreak.toDate, base=self.attr.base))}
          </div>
          <div class="row">
            ${statBox(title="Highest ever skill", body=get_template("components/pointInTimeStat.mako", skill=skillBounds['highest']['skill'], time=skillBounds['highest']['time'], base=self.attr.base))}
            ${statBox(title="Lowest ever skill", body=get_template("components/pointInTimeStat.mako", skill=skillBounds['lowest']['skill'], time=skillBounds['lowest']['time'], base=self.attr.base))}
            ${statBox(title="Longest winning streak", body=get_template("components/durationStat.mako", value=winStreak.count, fromDate=winStreak.fromDate, toDate=winStreak.toDate, base=self.attr.base))}
            ${statBox(title="Longest losing streak", body=get_template("components/durationStat.mako", value=loseStreak.count, fromDate=loseStreak.fromDate, toDate=loseStreak.toDate, base=self.attr.base))}
          </div>
          <div class="row">
            ${statBox(title="Total achievements", body=str(sum([len(g) for g in player.achievements.values()])) + '<div class="date"><a href="#achievements">See all</a></div>' )}
          </div>
        </div>
      </div>
      ${skillChart(player)}
      ${perPlayerStats(player)}
    </div>

    <div class="col-md-4">
      ${recentGames(player)}
      ${gamePanel('Most Significant Game', player.mostSignificantGame())}
      ${gamePanel('First Ever Game', player.games[0])}
      ${achievements(player)}
    </div>
  </div>
</div>
