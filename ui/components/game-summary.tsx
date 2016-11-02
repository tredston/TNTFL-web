import * as React from 'react';
import { Grid, Table } from 'react-bootstrap';
import * as moment from 'moment';

import Rank from './rank';
import PlayerName from './player-name';
import GameTime from './game-time';
import Achievement from '../model/achievement';
import Game from '../model/game';
import { getLadderLeagueClass, formatEpoch, formatRankChange } from '../utils/utils';

interface AchievementsSummaryProps {
  achievements: Achievement[];
  yellow: boolean;
}
function AchievementsSummary(props: AchievementsSummaryProps): JSX.Element {
  const { achievements, yellow } = props;
  return (
    <div className={yellow ? 'yellow-stripe' : ''}>
      {achievements.map((ach, i) =>
        <img src="/~tlr/tntfl-ui/img/trophy5_24.png" alt="Achievement unlocked!" title="Achievement unlocked!" key={`achcup${i}`}/> )
      }
    </div>
  );
}

interface GameScoreProps {
  redScore: number;
  blueScore: number;
  yellow: boolean;
}
function GameScore(props: GameScoreProps): JSX.Element {
  const { redScore, blueScore, yellow } = props;
  return (
    <div className={yellow ? 'yellow-stripe' : ''}>
      {redScore} - {blueScore}
    </div>
  );
}

interface SkillChangeProps {
  skillChange: number;
  colour: string;
}
function SkillChange(props: SkillChangeProps): JSX.Element {
  const { skillChange, colour } = props;
  return (
    <div>
      {skillChange > 0 &&
        <div className={'skill-change ' + colour}>
          {"+" + skillChange.toFixed(3)}
        </div>
      }
    </div>
  );
}

interface RankChangeProps {
  rankChange: number;
  colour: string;
}
function RankChange(props: RankChangeProps): JSX.Element {
  const { rankChange, colour } = props;
  return (
    <div>
      {rankChange !== 0 &&
        <div className={'skill-change ' + colour}>
          {formatRankChange(rankChange)}
        </div>
      }
    </div>
  );
}

interface GameSummaryProps {
  game: Game;
  base: string;
  numActivePlayers: number;
}
export default function GameSummary(props: GameSummaryProps): JSX.Element {
  const { game, base, numActivePlayers } = props;
  var redStripe = game.red.score == 10 && game.blue.score == 0;
  var blueStripe = game.red.score == 0 && game.blue.score == 10;
  return (
    <Grid fluid={true}>
      {game.deleted ? <p className="bg-danger">This game was deleted by {game.deleted.by} at {formatEpoch(game.deleted.at)}</p> : null}
      <Table id={'compactTable'}>
        <tbody>
          <tr className={'recent-game-result'}>
            <td style={{width: '20%'}}> <PlayerName name={game.red.name} base={base} colour="red-player" yellow={redStripe} /> </td>
            <td style={{width: '10%'}}> <Rank rank={game.red.newRank + game.red.rankChange} numActivePlayers={numActivePlayers} /> </td>
            <td style={{width: '10%'}}> <AchievementsSummary achievements={game.red.achievements} yellow={redStripe} /> </td>
            <td style={{width: '20%'}}> <GameScore redScore={game.red.score} blueScore={game.blue.score} yellow={redStripe || blueStripe} /> </td>
            <td style={{width: '10%'}}> <AchievementsSummary achievements={game.blue.achievements} yellow={blueStripe} /> </td>
            <td style={{width: '10%'}}> <Rank rank={game.blue.newRank + game.blue.rankChange} numActivePlayers={numActivePlayers} /> </td>
            <td style={{width: '20%'}}> <PlayerName name={game.blue.name} base={base} colour="blue-player" yellow={blueStripe} /> </td>
          </tr>
          <tr className={'game-changes'}>
            <td style={{width: '20%'}} className={'score-change red'}> <SkillChange skillChange={game.red.skillChange} colour="skill-change-red" /> </td>
            <td style={{width: '10%'}} className={'rank-change red'}> <RankChange rankChange={game.red.rankChange} colour="skill-change-red" /> </td>
            <td style={{width: '10%'}}/>
            <td style={{width: '20%', textAlign: 'center'}}> <GameTime date={game.date} base={base} /> </td>
            <td style={{width: '10%'}}/>
            <td style={{width: '10%'}} className={'rank-change blue'}> <RankChange rankChange={game.blue.rankChange} colour="skill-change-blue" /> </td>
            <td style={{width: '20%'}} className={'score-change red'}> <SkillChange skillChange={game.blue.skillChange} colour="skill-change-blue" /> </td>
          </tr>
        </tbody>
      </Table>
    </Grid>
  );
}
