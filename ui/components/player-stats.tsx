import * as React from 'react';
import { CSSProperties } from 'react';
import { Panel, Row, Col } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

import BoxPlot from './box-plot';
import { StatBox, DurationStatBox, InstantStatBox } from './stat-panel';
import Game from '../model/game';
import Player from '../model/player';
import * as Palette from '../palette';
import { getLadderLeagueClass, formatRankChange, getNearlyInactiveClass } from '../utils/utils';

interface RankStatBoxProps {
  rank: number;
  numActivePlayers: number;
  lastPlayed: number;
}
function RankStatBox(props: RankStatBoxProps): JSX.Element {
  const { rank, numActivePlayers, lastPlayed } = props;
  const now = (new Date()).getTime() / 1000;
  const league = getLadderLeagueClass(rank, numActivePlayers);
  const inactive = getNearlyInactiveClass(lastPlayed, now);
  const prettyRank = rank !== -1 ? rank : '-';
  return (
    <StatBox title="Current Ranking" style={{width: '100%'}} classes={`${league} ${inactive}`}>{prettyRank}</StatBox>
  )
}

interface GamesStatProps {
  player: Player;
}
function GamesStat(props: GamesStatProps): JSX.Element {
  const { player } = props;
  return (
    <StatBox title="Games">
      {player.total.games} games
      <Pie
        data={{
          labels: ['Wins', 'Draws', 'Losses'],
          datasets: [{
            data: [player.total.wins, player.total.games - player.total.wins - player.total.losses, player.total.losses],
            backgroundColor: ['blue', 'rgb(255, 194, 0)', 'red'],
          }],
        }}
        options={{legend: {display: false}}}
      />
    </StatBox>
  );
}

interface GoalsStatProps {
  player: Player;
}
function GoalsStat(props: GoalsStatProps): JSX.Element {
  const { player } = props;
  return (
    <StatBox title="Goals">
      {player.total.for + player.total.against} goals
      <Pie
        data={{
          labels: ['For', 'Against'],
          datasets: [{
            data: [player.total.for, player.total.against],
            backgroundColor: ['blue', 'red'],
          }],
        }}
        options={{legend: {display: false}}}
      />
    </StatBox>
  );
}

interface SidePreferenceStatProps {
  player: Player;
}
function SidePreferenceStat(props: SidePreferenceStatProps): JSX.Element {
  const { player } = props;
  const data = {
    labels: ['Red', 'Blue'],
    datasets: [{
      data: [player.total.gamesAsRed, player.total.games - player.total.gamesAsRed],
      backgroundColor: ['red', 'blue'],
    }],
  };
  const options = {
    legend: {display: false},
  };
  return (
    <StatBox title='Side preference'><Pie data={data} options={options}/></StatBox>
  )
}

function getSkillHistory(player: Player, games: Game[]) {
  return games.reduce((skillLine, game) => {
    const prevSkill = skillLine[skillLine.length - 1].skill;
    const change = game.red.name == player.name ? game.red.skillChange : game.blue.skillChange;
    skillLine.push({date: game.date, skill: (prevSkill + change)});
    return skillLine;
  }, [{date: 0, skill: 0}]);
}

function getSkillRecords(player: Player, games: Game[]) {
  const skillLine = getSkillHistory(player, games);
  const highestSkill = skillLine.reduce((highest, skill) => skill.skill > highest.skill ? skill : highest, {date: 0, skill: 0});
  const lowestSkill = skillLine.reduce((lowest, skill) => skill.skill < lowest.skill ? skill : lowest, {date: 0, skill: 0});
  return {highestSkill, lowestSkill};
}

// Get skill history for last 30 days
function getRecentSkillHistory(player: Player, games: Game[]) {
  const cutoff = Math.floor((new Date()).getTime() / 1000) - 2.592e+6;
  return getSkillHistory(player, games).filter(d => d.date >= cutoff);
}

interface Streak {
  win: boolean;
  gameTimes: number[];
}
function getStreakRecords(player: Player, games: Game[]) {
  const { streaks, currentStreak } = games.reduce(({streaks, currentStreak}, game) => {
    const won = (game.red.name == player.name && game.red.score > game.blue.score) || (game.blue.name == player.name && game.blue.score > game.red.score);
    const lost = (game.red.name == player.name && game.red.score < game.blue.score) || (game.blue.name == player.name && game.blue.score < game.red.score);
    if ((won && currentStreak.win) || lost && !currentStreak.win) {
      currentStreak.gameTimes.push(game.date);
    }
    else {
      if (currentStreak.gameTimes.length > 0) {
        streaks.push(currentStreak);
      }
      currentStreak = {win: won, gameTimes: []};
      if (won || lost) {
        currentStreak.gameTimes.push(game.date);
      }
    }
    return {streaks, currentStreak};
  }, {streaks: [], currentStreak: {win: true, gameTimes: []}});
  const winningStreak = streaks.reduce((winning, streak) => (streak.win && streak.gameTimes.length > winning.gameTimes.length) ? streak : winning , {win: true, gameTimes: []});
  const losingStreak = streaks.reduce((losing, streak) => (!streak.win && streak.gameTimes.length > losing.gameTimes.length) ? streak : losing, {win: false, gameTimes: []});
  return {winningStreak, losingStreak, currentStreak};
}

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  numActivePlayers: number;
  base: string;
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
  function getBG(blue: number): CSSProperties {
    if (blue == 0) {
      return {};
    }
    return {backgroundColor: blue > 0 ? Palette.blueFade : Palette.redFade};
  }
  const { player, numActivePlayers, games, base } = props;
  const overrated = getOverrated(player.name, games);
  const gamesToday = games.slice(games.length - player.total.gamesToday);
  const goalRatio = player.total.for / player.total.against;
  const flawlessVictories = games.reduce((count, game) => count += isTenNilWin(player.name, game) ? 1 : 0, 0);
  const skillChangeToday = gamesToday.reduce((skill, game) => skill += game.red.name == player.name ? game.red.skillChange : game.blue.skillChange, 0);
  const rankChangeToday = gamesToday.reduce((change, game) => change += game.red.name == player.name ? game.red.rankChange : game.blue.rankChange, 0);
  const { highestSkill, lowestSkill } = getSkillRecords(player, games);
  const { winningStreak, losingStreak, currentStreak } = getStreakRecords(player, games);
  return (
    <Panel header={<h1>{player.name}</h1>}>
      <Col sm={3}>
        <StatBox title={'Recent Skill'}>
          <BoxPlot data={getRecentSkillHistory(player, games).map(d => d.skill)}/>
        </StatBox>
      </Col>
      <Col sm={3}><RankStatBox rank={player.rank} numActivePlayers={numActivePlayers} lastPlayed={games[games.length - 1].date} /></Col>
      <Col sm={3}><StatBox title="Skill">{player.skill.toFixed(3)}</StatBox></Col>
      <Col sm={3}><StatBox title={'Overrated'} style={getBG(overrated)}>{overrated.toFixed(3)}</StatBox></Col>
      <Col sm={3}><StatBox title='Flawless Victories'>{flawlessVictories}</StatBox></Col>
      <Col sm={3}><GamesStat player={player} /></Col>
      <Col sm={3}><GoalsStat player={player} /></Col>
      <Col sm={3}><SidePreferenceStat player={player}/></Col>
      <Col sm={3}><StatBox title="Skill change today" style={getBG(skillChangeToday)}>{skillChangeToday.toFixed(3)}</StatBox></Col>
      <Col sm={3}><StatBox title="Rank change today" style={getBG(rankChangeToday)}>{formatRankChange(rankChangeToday)}</StatBox></Col>
      <Col sm={3}>
        <DurationStatBox title={'Current streak'}
          from={currentStreak.gameTimes[0]}
          to={currentStreak.gameTimes[currentStreak.gameTimes.length - 1]}
          base={base}
        >
          {currentStreak.gameTimes.length > 0 ? `${currentStreak.gameTimes.length} ${currentStreak.win ? 'wins' : 'losses'}` : '-'}
        </DurationStatBox>
      </Col>
      <Col sm={3}><InstantStatBox title={'Highest ever skill'} at={highestSkill.date} base={base}>{highestSkill.skill.toFixed(3)}</InstantStatBox></Col>
      <Col sm={3}><InstantStatBox title={'Lowest ever skill'} at={lowestSkill.date} base={base}>{lowestSkill.skill.toFixed(3)}</InstantStatBox></Col>
      <Col sm={3}>
        <DurationStatBox
          title={'Longest winning streak'}
          from={winningStreak.gameTimes[0]}
          to={winningStreak.gameTimes[winningStreak.gameTimes.length - 1]}
          base={base}
        >
          {winningStreak.gameTimes.length || '-'}
        </DurationStatBox>
      </Col>
      <Col sm={3}>
        <DurationStatBox
          title={'Longest losing streak'}
          from={losingStreak.gameTimes[0]}
          to={losingStreak.gameTimes[losingStreak.gameTimes.length - 1]}
          base={base}
        >
          {losingStreak.gameTimes.length || '-'}
        </DurationStatBox>
      </Col>
    </Panel>
  );
}
