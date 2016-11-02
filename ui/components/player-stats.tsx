import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';

import Game from '../model/game';
import Player from '../model/player';
import * as Palette from '../palette';
import { getParameterByName, getLadderLeagueClass, formatEpoch, formatRankChange } from '../utils/utils';

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

interface SidePreferenceStatProps {
  player: Player;
}
function SidePreferenceStat(props: SidePreferenceStatProps): JSX.Element {
  const { player } = props;
  const redness = (player.total.gamesAsRed / player.total.games);
  const style = {backgroundColor: 'rgb(' + Math.round(redness * 255) + ', 0, '  + Math.round((1 - redness) * 255) + ')'};
  const pc = redness * 100;
  const preference = (pc >= 50) ? (pc.toFixed(2) + '% red') : ((100-pc).toFixed(2) + '% blue');
  return (
    <StatBox title='Side preference' classes='side-preference' style={style}>{preference}</StatBox>
  )
}

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  numActivePlayers: number;
}
export default function PlayerStats(props: PlayerStatsProps): JSX.Element {
  function isTenNilWin(playerName: string, game: Game): boolean {
    return (game.red.score == 10 && game.blue.score == 0 && game.red.name == playerName) ||
      (game.blue.score == 10 && game.red.score == 0 && game.blue.name == playerName);
  }
  function getOverrated(playerName: string, games: Game[]): number {
    let skill = 0;
    let total = 0;
    games.slice(games.length - 10).forEach((game) => {
      skill += game.red.name === playerName ? game.red.skillChange : game.blue.skillChange;
      total += skill;
    })
    return skill - (total / 10);
  }
  function getBG(blue: boolean): CSSProperties {
    return {backgroundColor: blue ? Palette.blueFade : Palette.redFade};
  }
  const { player, numActivePlayers, games } = props;
  const rank = player.rank !== -1 ? player.rank : '-';
  const overrated = getOverrated(player.name, games);
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
        <Col sm={3}><StatBox title={'Overrated'} style={getBG(overrated >= 0)}>{overrated.toFixed(3)}</StatBox></Col>
        <Col sm={3}><SidePreferenceStat player={player}/></Col>
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
        <Col sm={3}><StatBox title="Goal ratio" style={getBG(goalRatio > 1)}>{goalRatio.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title='10-0 wins'>{tenNils}</StatBox></Col>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Games today">{gamesToday.length}</StatBox></Col>
        <Col sm={3}><StatBox title="Skill change today" style={getBG(skillChangeToday >= 0)}>{skillChangeToday.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title="Rank change today" style={getBG(rankChangeToday >= 0)}>{formatRankChange(rankChangeToday)}</StatBox></Col>
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
