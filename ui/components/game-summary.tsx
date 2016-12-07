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
  base: string;
}
function AchievementsSummary(props: AchievementsSummaryProps): JSX.Element {
  const { achievements, base } = props;
  return (
    <div style={{display: 'table', marginLeft: 'auto', marginRight: 'auto'}}>
      {achievements.map((ach, i) =>
        <div style={{display: 'table-cell'}} key={`${i}`}>
          <img
            src={`${base}img/trophy5_24.png`}
            alt="Achievement unlocked!"
            title="Achievement unlocked!"
            style={{width: '100%'}}
          />
        </div>
      )}
    </div>
  );
}

interface GameScoreProps {
  redScore: number;
  blueScore: number;
}
function GameScore(props: GameScoreProps): JSX.Element {
  const { redScore, blueScore } = props;
  return (
    <div>
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

function stripe(b: boolean): string {
  return b ? 'yellow-stripe' : '';
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
            <td style={{width: '20%'}} className={stripe(redStripe)}> <PlayerName name={game.red.name} base={base} colour={redStripe ? 'yellow-stripe' : 'red-player'} /> </td>
            <td style={{width: '10%'}} className={stripe(redStripe)}> <Rank rank={game.red.newRank + game.red.rankChange} numActivePlayers={numActivePlayers} /> </td>
            <td style={{width: '10%'}} className={stripe(redStripe)}> <AchievementsSummary achievements={game.red.achievements} base={base}/> </td>
            <td style={{width: '20%'}} className={stripe(redStripe || blueStripe)}> <GameScore redScore={game.red.score} blueScore={game.blue.score}/> </td>
            <td style={{width: '10%'}} className={stripe(blueStripe)}> <AchievementsSummary achievements={game.blue.achievements} base={base}/> </td>
            <td style={{width: '10%'}} className={stripe(blueStripe)}> <Rank rank={game.blue.newRank + game.blue.rankChange} numActivePlayers={numActivePlayers} /> </td>
            <td style={{width: '20%'}} className={stripe(blueStripe)}> <PlayerName name={game.blue.name} base={base} colour={blueStripe ? 'yellow-stripe' : 'blue-player'} /> </td>
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
