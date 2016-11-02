import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';

import Game from '../model/game';
import Player from '../model/player';
import { getParameterByName, getLadderLeagueClass, formatEpoch } from '../utils/utils';

interface StatBoxProps {
  title: string;
  caption?: string;
  classes?: string;
  style?: CSSProperties;
  children?: any;
}
function StatBox(props: StatBoxProps): JSX.Element {
  const { title, caption, children, classes, style } = props;
  return (
    <Panel className={classes} header={<h3>{title}</h3>} style={Object.assign({width: 'auto'}, style)}>
      {children}
    </Panel>
  );
}

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  numActivePlayers: number;
}
export default function PlayerStats(props: PlayerStatsProps): JSX.Element {
  function sideStyle(player: Player): CSSProperties {
    var redness = (player.total.gamesAsRed / player.total.games);
    return {backgroundColor: 'rgb(' + Math.round(redness * 255) + ', 0, '  + Math.round((1 - redness) * 255) + ')'};
  };
  function sidePreference(player: Player): string {
    var redness = (player.total.gamesAsRed / player.total.games) * 100;
    return (redness >= 50) ? (redness.toFixed(2) + "% red") : ((100-redness).toFixed(2) + "% blue")
  };
  function isTenNilWin(playerName: string, game: Game): boolean {
    return (game.red.score == 10 && game.blue.score == 0 && game.red.name == playerName) ||
      (game.blue.score == 10 && game.red.score == 0 && game.blue.name == playerName);
  }
  const { player, numActivePlayers, games } = props;
  const rank = player.rank !== -1 ? player.rank : '-';
  const gamesToday = games.slice(games.length - player.total.gamesToday);
  const goalRatio = player.total.for / player.total.against;
  const tenNils = games.reduce((count, game) => count += isTenNilWin(player.name, game) ? 1 : 0, 0);
  const skillChangeToday = gamesToday.reduce((skill, game) => skill += game.red.name == player.name ? game.red.skillChange : game.blue.skillChange, 0);
  const rankChangeToday = gamesToday.reduce((change, game) => change += game.red.name == player.name ? game.red.rankChange : game.blue.rankChange, 0);
  return (
    <Panel header={<h1>{player.name}</h1>}>
      <Row>
        <Col sm={3}><StatBox title="Current Ranking" classes={"ladder-position " + getLadderLeagueClass(player.rank, numActivePlayers)}>
          {rank}
        </StatBox></Col>
        <Col sm={3}><StatBox title="Skill">{player.skill.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title="Side preference" classes="side-preference" style={sideStyle(player)}>{sidePreference(player)}</StatBox></Col>
        <Col sm={3}/>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Total games">{player.total.games}</StatBox></Col>
        <Col sm={3}><StatBox title="Wins">{player.total.wins}</StatBox></Col>
        <Col sm={3}><StatBox title="Losses">{player.total.losses}</StatBox></Col>
        <Col sm={3}><StatBox title="Draws">{(player.total.games - player.total.wins - player.total.losses)}</StatBox></Col>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Goals for">{player.total.for}</StatBox></Col>
        <Col sm={3}><StatBox title="Goals against">{player.total.against}</StatBox></Col>
        <Col sm={3}><StatBox title="Goal ratio" classes={goalRatio > 1 ? "positive" : "negative"}>{goalRatio.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title='10-0 wins'>{tenNils}</StatBox></Col>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Games today">{gamesToday.length}</StatBox></Col>
        <Col sm={3}><StatBox title="Skill change today" classes={skillChangeToday >= 0 ? "positive" : "negative"}>{skillChangeToday.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title="Rank change today" classes={rankChangeToday >= 0 ? "positive" : "negative"}>{rankChangeToday}</StatBox></Col>
        <Col sm={3}/>
        {/*TODO <StatBox title="Current streak">{get_template("durationStat.mako", value="{0} {1}".format(currentStreak.count, currentStreakType), fromDate=currentStreak.fromDate, toDate=currentStreak.toDate, base=self.attr.base))</StatBox>*/}
      </Row>
      <Row>
        {/*TODO <StatBox title="Highest ever skill">{get_template("pointInTimeStat.mako", skill=skillBounds['highest']['skill'], time=skillBounds['highest']['time'], base=self.attr.base))</StatBox>*/}
        {/*TODO <StatBox title="Lowest ever skill">{get_template("pointInTimeStat.mako", skill=skillBounds['lowest']['skill'], time=skillBounds['lowest']['time'], base=self.attr.base))</StatBox>*/}
        {/*TODO <StatBox title="Longest winning streak">{get_template("durationStat.mako", value=winStreak.count, fromDate=winStreak.fromDate, toDate=winStreak.toDate, base=self.attr.base))</StatBox>*/}
        {/*TODO <StatBox title="Longest losing streak">{get_template("durationStat.mako", value=loseStreak.count, fromDate=loseStreak.fromDate, toDate=loseStreak.toDate, base=self.attr.base))</StatBox>*/}
      </Row>
    </Panel>
  );
}
