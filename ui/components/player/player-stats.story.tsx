import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Game, Player } from 'tntfl-api';

import PlayerStats from './player-stats';

function createGames(num: number): Game[] {
  const games: Game[] = [];
  for (let i = 0; i < num; i++) {
    games.push({
      blue: {
        href: '../../../player/foo/json',
        skillChange: -12.52781688010303,
        score: 1,
        rankChange: 0,
        achievements: [],
        name: 'foo',
        newRank: 17,
      },
      date: ((new Date()).getTime() / 1000) - 1000 + i,
      red: {
        href: '../../../player/bar/json',
        skillChange: 12.52781688010303,
        score: 9,
        rankChange: 0,
        achievements: [],
        name: 'bar',
        newRank: 22,
      },
      positionSwap: false,
    });
  }
  return games;
}

function createStory(): () => JSX.Element {
  const player: Player = {
    name: 'foo',
    rank: 6,
    total: {
      losses: 375,
      wins: 595,
      games: 1190,
      against: 5494,
      gamesAsRed: 609,
      gamesToday: 2,
      for: 6419,
    },
    games: {
      href: 'games/json',
    },
    skill: 56.814402967766014,
    active: true,
  };
  const games: Game[] = createGames(20);
  return () => <PlayerStats player={player} games={games} numActivePlayers={1} base={''} />;
}

storiesOf('PlayerStats', module)
  .add('Default', createStory());
