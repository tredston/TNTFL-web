import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import * as classNames from 'classnames';
import * as moment from 'moment';

import GameTime from './game-time';
import PlayerNameLink from './player-name-link';
import Achievement from '../model/achievement';
import Game from '../model/game';
import { getLadderLeagueClass, formatEpoch } from '../utils/utils';

interface PlayerNameProps {
  name: string;
  base: string;
  colour: string;
  yellow: boolean;
}
function PlayerName(props: PlayerNameProps): JSX.Element {
  const { name, base, colour, yellow } = props;
  var className = classNames(
    'playerName',
    colour,
    yellow ? 'yellow-stripe' : ''
  );
  return (
    <div className={className}>
      <PlayerNameLink base={base} name={name} />
    </div>
  );
}

interface AchievementsSummaryProps {
  achievements: Achievement[];
  yellow: boolean;
}
function AchievementsSummary(props: AchievementsSummaryProps): JSX.Element {
  const { achievements, yellow } = props;
  var className = classNames(
    'achievementsSummary',
    yellow ? 'yellow-stripe' : ''
  );
  return (
    <div className={className}>
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
  var className = classNames(
    'gameScore',
    yellow ? 'yellow-stripe' : ''
  );
  return (
    <div className={className}>
      {redScore} - {blueScore}
    </div>
  );
}

interface RankProps {
  rank: number;
  numActivePlayers: number;
}
function Rank(props: RankProps): JSX.Element {
  const { rank, numActivePlayers } = props;
  var classes = classNames(
    'rank',
    "ladder-position",
    getLadderLeagueClass(rank, numActivePlayers)
  );
  return (
    <div className={classes}>
      {rank}
    </div>
  );
}

interface SkillChangeProps {
  skillChange: number;
  colour: string;
}
function SkillChange(props: SkillChangeProps): JSX.Element {
  const { skillChange, colour } = props;
  var classes = classNames(
    'skillChange',
    skillChange <= 0 ? 'invisible' : ''
  );
  var inner = classNames(
    'skill-change',
    colour
  );
  return (
    <div className={classes}>
      <div className={inner}>
        {"+" + skillChange.toFixed(3)}
      </div>
    </div>
  );
}

interface RankChangeProps {
  rankChange: number;
  colour: string;
}
function RankChange(props: RankChangeProps): JSX.Element {
  const { rankChange, colour } = props;
  var classes = classNames(
    'rankChange',
    rankChange == 0 ? 'invisible' : ''
  );
  var inner = classNames(
    'skill-change',
    colour
  );
  return (
    <div className={classes}>
      <div className={inner}>
        {rankChange}
      </div>
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
    <div className="gameSummary recent-game">
      <Grid>
      {game.deleted ? <p className="bg-danger">This game was deleted by {game.deleted.by} at {formatEpoch(game.deleted.at)}</p> : null}
      <div className="recent-game-result">
        <Row>
          <Col md={2}> <PlayerName name={game.red.name} base={base} colour="red-player" yellow={redStripe} /> </Col>
          <Col md={1}> <Rank rank={game.red.newRank + game.red.rankChange} numActivePlayers={numActivePlayers} /> </Col>
          <Col md={1}> <AchievementsSummary achievements={game.red.achievements} yellow={redStripe} /> </Col>
          <Col md={4}> <GameScore redScore={game.red.score} blueScore={game.blue.score} yellow={redStripe || blueStripe} /> </Col>
          <Col md={1}> <AchievementsSummary achievements={game.blue.achievements} yellow={blueStripe} /> </Col>
          <Col md={1}> <Rank rank={game.blue.newRank + game.blue.rankChange} numActivePlayers={numActivePlayers} /> </Col>
          <Col md={2}> <PlayerName name={game.blue.name} base={base} colour="blue-player" yellow={blueStripe} /> </Col>
        </Row>
      </div>
      <div className="game-changes">
        <Row>
          <Col md={2}> <SkillChange skillChange={game.red.skillChange} colour="skill-change-red" /> </Col>
          <Col md={1}> <RankChange rankChange={game.red.rankChange} colour="skill-change-red" /> </Col>
          <Col md={6}> <GameTime date={game.date} base={base} /> </Col>
          <Col md={1}> <RankChange rankChange={game.blue.rankChange} colour="skill-change-blue" /> </Col>
          <Col md={2}> <SkillChange skillChange={game.blue.skillChange} colour="skill-change-blue" /> </Col>
        </Row>
      </div>
      </Grid>
    </div>
  );
}
