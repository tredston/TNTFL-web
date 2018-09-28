import { GamesApi, LadderApi, PlayersApi, StatsApi } from 'tntfl-api';

export function gamesApi(): GamesApi {
  return new GamesApi(undefined, '', fetch);
}

export function playersApi(): PlayersApi {
  return new PlayersApi(undefined, '', fetch);
}

export function ladderApi(): LadderApi {
  return new LadderApi(undefined, '', fetch);
}

export function statsApi(): StatsApi {
  return new StatsApi(undefined, '', fetch);
}
