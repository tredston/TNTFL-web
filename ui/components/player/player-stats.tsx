import * as React from 'react';
import { CSSProperties } from 'react';
import { Panel } from 'react-bootstrap';
import { Game, Player } from 'tntfl-api';

import GamesStat from './games-stat';
import GoalsStat from './goals-stat';
import RankStat from './rank-stat';
import SidePreferenceStat from './side-preference-stat';
import BoxPlot from './box-plot';
import { StatBox, DurationStatBox, InstantStatBox } from './stat-panel';
import * as Palette from '../../palette';
import { formatRankChange, skillChange } from '../../utils/utils';

function getSkillHistory(player: Player, games: Game[]) {
  return games.reduce((skillLine, game) => {
    const prevSkill = skillLine[skillLine.length - 1].skill;
    skillLine.push({date: game.date, skill: (prevSkill + skillChange(game, player))});
    return skillLine;
  }, [{date: 0, skill: 0}]);
}

function getSkillRecords(player: Player, games: Game[]) {
  const skillLine = getSkillHistory(player, games);
  const highestSkill = skillLine.reduce((highest, skill) => skill.skill > highest.skill ? skill : highest, {date: 0, skill: 0});
  const lowestSkill = skillLine.reduce((lowest, skill) => skill.skill < lowest.skill ? skill : lowest, {date: 0, skill: 0});
  return {highestSkill, lowestSkill};
}

interface Streak {
  win: boolean;
  gameTimes: number[];
}
function getStreaks(player: Player, games: Game[]) {
  return games.reduce(({streaks, currentStreak}, game) => {
    const won = (game.red.name === player.name && game.red.score > game.blue.score) || (game.blue.name === player.name && game.blue.score > game.red.score);
    const lost = (game.red.name === player.name && game.red.score < game.blue.score) || (game.blue.name === player.name && game.blue.score < game.red.score);
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
  }, {streaks: [] as Streak[], currentStreak: {win: true, gameTimes: []} as Streak});
}
function getStreakRecords(player: Player, games: Game[]) {
  const { streaks, currentStreak } = getStreaks(player, games);
  const winningStreak = streaks.reduce((winning, streak) => (streak.win && streak.gameTimes.length > winning.gameTimes.length) ? streak : winning , {win: true, gameTimes: []});
  const losingStreak = streaks.reduce((losing, streak) => (!streak.win && streak.gameTimes.length > losing.gameTimes.length) ? streak : losing, {win: false, gameTimes: []});
  return {winningStreak, losingStreak, currentStreak};
}

function isTenNilWin(playerName: string, game: Game): boolean {
  return (game.red.score === 10 && game.blue.score === 0 && game.red.name === playerName) ||
    (game.blue.score === 10 && game.red.score === 0 && game.blue.name === playerName);
}

function getBG(blue: number): CSSProperties {
  if (blue === 0) {
    return {};
  }
  return {backgroundColor: blue > 0 ? Palette.blueFade : Palette.redFade};
}

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  numActivePlayers: number;
  base: string;
}
export default function PlayerStats(props: PlayerStatsProps): JSX.Element {
  const { player, numActivePlayers, games, base } = props;
  const gamesToday = player.total.gamesToday !== undefined ? games.slice(games.length - player.total.gamesToday) : [];
  const flawlessVictories = games.reduce((count, game) => count += isTenNilWin(player.name, game) ? 1 : 0, 0);
  const skillChangeToday = gamesToday.reduce((skill, game) => skill += skillChange(game, player), 0);
  const rankChangeToday = gamesToday.reduce((change, game) => change += game.red.name === player.name ? game.red.rankChange : game.blue.rankChange, 0);
  const { highestSkill, lowestSkill } = getSkillRecords(player, games);
  const { winningStreak, losingStreak, currentStreak } = getStreakRecords(player, games);
  const monthAgo = Math.floor((new Date()).getTime() / 1000) - 2.592e+6;
  const rowStyle: CSSProperties = {display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' };
  return (
    <Panel>
      <Panel.Heading><h1>{player.name}</h1></Panel.Heading>
      <Panel.Body>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <StatBox title={'Recent Skill'}><BoxPlot data={getSkillHistory(player, games).filter(d => d.date >= monthAgo).map(d => d.skill)}/></StatBox>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <div style={rowStyle}>
              <div style={{display: 'flex'}}><RankStat rank={player.rank} numActivePlayers={numActivePlayers} activity={player.activity} /></div>
              <div style={{display: 'flex'}}><StatBox title='Skill'>{player.skill.toFixed(3)}</StatBox></div>
              <div style={{display: 'flex'}}><StatBox title='Skill change today' style={getBG(skillChangeToday)}>{skillChangeToday.toFixed(3)}</StatBox></div>
              <div style={{display: 'flex'}}><StatBox title='Rank change today' style={getBG(rankChangeToday)}>{formatRankChange(rankChangeToday)}</StatBox></div>
              <div style={{display: 'flex'}}>
                <DurationStatBox title={'Current streak'}
                  from={currentStreak.gameTimes[0]}
                  to={currentStreak.gameTimes[currentStreak.gameTimes.length - 1]}
                  base={base}
                >
                  {currentStreak.gameTimes.length > 0 ? `${currentStreak.gameTimes.length} ${currentStreak.win ? 'wins' : 'losses'}` : '-'}
                </DurationStatBox>
              </div>

              <div style={{display: 'flex'}}><GamesStat player={player} /></div>
              <div style={{display: 'flex'}}><GoalsStat player={player} /></div>
              <div style={{display: 'flex'}}><SidePreferenceStat player={player} /></div>

              <div style={{display: 'flex'}}><StatBox title='Flawless Victories'>{flawlessVictories}</StatBox></div>
              <div style={{display: 'flex'}}><InstantStatBox title={'Highest ever skill'} at={highestSkill.date} base={base}>{highestSkill.skill.toFixed(3)}</InstantStatBox></div>
              <div style={{display: 'flex'}}><InstantStatBox title={'Lowest ever skill'} at={lowestSkill.date} base={base}>{lowestSkill.skill.toFixed(3)}</InstantStatBox></div>
              <div style={{display: 'flex'}}>
                <DurationStatBox
                  title={'Longest winning streak'}
                  from={winningStreak.gameTimes[0]}
                  to={winningStreak.gameTimes[winningStreak.gameTimes.length - 1]}
                  base={base}
                >
                  {winningStreak.gameTimes.length || '-'}
                </DurationStatBox>
              </div>
              <div style={{display: 'flex'}}>
                <DurationStatBox
                  title={'Longest losing streak'}
                  from={losingStreak.gameTimes[0]}
                  to={losingStreak.gameTimes[losingStreak.gameTimes.length - 1]}
                  base={base}
                >
                  {losingStreak.gameTimes.length || '-'}
                </DurationStatBox>
              </div>
            </div>
          </div>
        </div>
      </Panel.Body>
    </Panel>
  );
}
