<%!
title = "Head to Head | "
base = "../../../"
from tntfl.game import Game
import tntfl.template_utils as utils

def getNumWins(player, games):
    return len([g for g in games if (g.redPlayer == player.name and g.redScore > g.blueScore) or (g.bluePlayer == player.name and g.blueScore > g.redScore)])

def getNumGoals(player, games):
    return sum(g.redScore if g.redPlayer == player.name else g.blueScore for g in games)

def getSkillChange(player, games):
    return sum(g.skillChangeToBlue if g.bluePlayer == player.name else -g.skillChangeToBlue for g in games)

def incrementHistogramScore(histogramData, player, score):
    if score not in histogramData[player]:
        histogramData[player][score] = 0
    histogramData[player][score] += 1

def getHistograms(player1, player2, sharedGames):
    histogramData = {'player1': {}, 'player2': {}}
    for game in sharedGames:
        if game.redPlayer == player1.name:
            incrementHistogramScore(histogramData, 'player1', game.redScore)
            incrementHistogramScore(histogramData, 'player2', game.blueScore)
        elif game.bluePlayer == player1.name:
            incrementHistogramScore(histogramData, 'player1', game.blueScore)
            incrementHistogramScore(histogramData, 'player2', game.redScore)
    player1Histogram = []
    player2Histogram = []
    for goals, tally in histogramData['player1'].iteritems():
        player1Histogram.append([goals, tally])
    for goals, tally in histogramData['player2'].iteritems():
        player2Histogram.append([goals, tally * -1])
    return {'player1': player1Histogram, 'player2': player2Histogram}
%>
<%inherit file="html.mako" />

<%def name="skillAt(skill, base)">
  ${"{:.3f}".format(skill['skill'])}
  <br />
  % if skill['time'] > 0:
    at <a href="${base}game/${skill['time']}/">${utils.formatTime(skill['time'])}</a>
  % else:
    before first game
  % endif
</%def>

<%def name="headtoheadplayer(player, colour, totalActivePlayers)">
  <%
  rank = ladder.getPlayerRank(player.name)
  skillBounds = player.getSkillBounds()
  %>
  <div class="panel panel-default headtohead">
    <h1 class="${colour}-player panel-title">${player.name}</h1>
    <div class="panel-body">
    <table class="player-stats">
      <tr>
        <th>Rank</th><td class="rank ${utils.getRankCSS(ladder.getPlayerRank(player.name), totalActivePlayers)}">${rank if rank != -1 else "-"}</td>
        <th>Skill</th><td class="ladder-skill">${"{:.3f}".format(player.elo)}</td>
      </tr>
      <tr>
        <th>Highest ever skill</th>
        <td>
          ${skillAt(skillBounds['highest'], base)}
        </td>
        <th>Lowest ever skill</th>
        <td>
          ${skillAt(skillBounds['lowest'], base)}
        </td>
      </tr>
      </table>
      </div>
  </div>
</%def>

<%def name="stat(statName, player1stat, p1highlight, player2stat, p2highlight)">
  <td ${"class='red-player'" if p1highlight else ""}>${player1stat}</td>
  <th>${statName}</th>
  <td ${"class='blue-player'" if p2highlight else ""}>${player2stat}</td>
</%def>

<%def name="stats(player1, player2, sharedGames)">
  <%
      draws = len([g for g in sharedGames if g.redScore == g.blueScore])
      player1wins = getNumWins(player1, sharedGames)
      player2wins = len(sharedGames) - draws - player1wins
      player1goals = getNumGoals(player1, sharedGames)
      player2goals = getNumGoals(player2, sharedGames)
      player1yellowStripes = utils.getNumYellowStripes(player1, sharedGames)
      player2yellowStripes = utils.getNumYellowStripes(player2, sharedGames)
      swingToPlayer1 = getSkillChange(player1, sharedGames)
      predict = ladder.predict(player1, player2) * 10
  %>
  <div class="col-md-4">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h2 class="panel-title">Statistics</h2>
      </div>
      <div class="panel-body">
        <p>Matches played: ${len(sharedGames)} (${draws} draws)</p>
        <table class="table headtohead">
          <tr>${stat('', player1.name, false, player2.name, false)}</tr>
          <tr>${stat('Points Swing', "{:.3f}".format(swingToPlayer1) if swingToPlayer1 >= 0 else '', swingToPlayer1 >= 0, "{:.3f}".format(-swingToPlayer1) if swingToPlayer1 < 0 else '', swingToPlayer1 < 0)}</tr>
          <tr>${stat('Wins', player1wins, player1wins >= player2wins, player2wins, player1wins <= player2wins)}</tr>
          <tr>${stat('10-0 Wins', player1yellowStripes, player1yellowStripes >= player2yellowStripes, player2yellowStripes, player1yellowStripes <= player2yellowStripes)}</tr>
          <tr>${stat('Goals', player1goals, player1goals >= player2goals, player2goals, player1goals <= player2goals)}</tr>
          <tr>${stat('Predicted Result', "{:.0f}".format(10 - predict), true, "{:.0f}".format(predict), true)}</tr>
        </table>
      </div>
    </div>
  </div>
</%def>

<%def name="recent(ladder, sharedGames, base)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Recent Encounters</h2>
    </div>
    <div class="panel-body">
      ${self.blocks.render("recent", base=base, ladder=ladder, games=sharedGames, limit=5)}
      <a class="pull-right" href="games/">See all games</a>
    </div>
  </div>
</%def>

<%def name="goalDistribution(histograms)">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h2 class="panel-title">Goal Distribution</h2>
    </div>
    <div class="panel-body">
      <div id="histogram">
      </div>
      <script type="text/javascript">
        plotHeadToHeadGoals("#histogram", [${histograms['player1']}, ${histograms['player2']}]);
      </script>
    </div>
  </div>
</%def>

<%
totalActivePlayers = ladder.getNumActivePlayers()
sharedGames = utils.getSharedGames(player1, player2)
%>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-12">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h1 class="panel-title">Head to Head</h1>
        </div>
        <div class="panel-body container-fluid">
          <div class="row">
            <div class="col-md-4">
              ${headtoheadplayer(player1, "red", totalActivePlayers)}
              ${recent(ladder, sharedGames, self.attr.base)}
            </div>
            ${stats(player1, player2, sharedGames)}
            <div class="col-md-4">
              ${headtoheadplayer(player2, "blue", totalActivePlayers)}
              ${goalDistribution(getHistograms(player1, player2, sharedGames))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
