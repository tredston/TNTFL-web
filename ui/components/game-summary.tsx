import * as React from 'react';
import * as classNames from 'classnames';
import * as moment from 'moment';

import Achievement from '../model/achievement';
import Game from '../model/game';

function getLadderLeagueClass(rank: number, numActivePlayers: number) {
  var league = "";
  if (rank == -1)
    league = "inactive";
  if (rank == 1)
    league = "ladder-first";
  if (1 < rank && rank <= numActivePlayers * 0.1)
    league = "ladder-silver";
  if (0.1 * numActivePlayers < rank && rank <= numActivePlayers * 0.3)
    league = "ladder-bronze";
  return league;
}

function format(t: number): string {
  const asStr = "" + t.toFixed(3);
  if (t >= 0)
    return "+" + t;
  return asStr;
}

function formatDate(date: moment.Moment) {
  if (date.isBefore(moment().subtract(7, 'days'))) {
    return date.format("YYYY-MM-DD HH:mm");
  }
  else if (date.isBefore(moment().startOf('day'))) {
    return date.format("ddd HH:mm");
  }
  else {
    return date.format("HH:mm");
  }
}

function formatEpoch(epoch: number) {
  return formatDate(moment.unix(epoch));
}

interface PlayerNameLinkProps {
  name: string;
  base: string;
}
export function PlayerNameLink(props: PlayerNameLinkProps): JSX.Element {
  const { name, base } = props;
  return (
    <a className='playerNameLink' href={base + "player/" + name}>
      {name}
    </a>
  );
}

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
  var cups = achievements.map(function(ach) {
    return (
      <img src="/~tlr/tntfl-ui/img/trophy5_24.png" alt="Achievement unlocked!" title="Achievement unlocked!"/>
    );
  });
  return (
    <div className={className}>
      {cups}
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

interface GameTimeProps {
  date: number;
  base: string;
}
export function GameTime(props: GameTimeProps): JSX.Element {
  const { date, base } = props;
  return (
    <span className="gameTime">
      <a href={base + "game/" + date}>
        {formatEpoch(date)}
      </a>
    </span>
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
    skillChange == 0 ? 'invisible' : ''
  );
  var inner = classNames(
    'skill-change',
    colour
  );
  return (
    <div className={classes}>
      <div className={inner}>
        {format(skillChange)}
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
        {format(rankChange)}
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
      {game.deleted ? <p className="bg-danger">This game was deleted by {game.deleted.by} at {formatEpoch(game.deleted.at)}</p> : null}
      <div className="recent-game-result">
        <PlayerName name={game.red.name} base={base} colour="red-player" yellow={redStripe} />
        <Rank rank={game.red.newRank + game.red.rankChange} numActivePlayers={numActivePlayers} />
        <AchievementsSummary achievements={game.red.achievements} yellow={redStripe} />
        <GameScore redScore={game.red.score} blueScore={game.blue.score} yellow={redStripe || blueStripe} />
        <AchievementsSummary achievements={game.blue.achievements} yellow={blueStripe} />
        <Rank rank={game.blue.newRank + game.blue.rankChange} numActivePlayers={numActivePlayers} />
        <PlayerName name={game.blue.name} base={base} colour="blue-player" yellow={blueStripe} />
      </div>
      <div className="game-changes">
        <SkillChange skillChange={game.red.skillChange} colour="skill-change-red" />
        <RankChange rankChange={game.red.rankChange} colour="skill-change-red" />
        <GameTime date={game.date} base={base} />
        <RankChange rankChange={game.blue.rankChange} colour="skill-change-blue" />
        <SkillChange skillChange={game.blue.skillChange} colour="skill-change-blue" />
      </div>
    </div>
  );
}

interface GameListProps {
  games: Game[];
  base: string;
  numActivePlayers: number;
}
export function GameList(props: GameListProps): JSX.Element {
  const { games, base, numActivePlayers } = props;
  return (
    <div className="gameList">
      <div className="container-fluid">
        {games.map((game) => <GameSummary game={game} base={base} numActivePlayers={numActivePlayers}/> )}
      </div>
    </div>
  );
}
