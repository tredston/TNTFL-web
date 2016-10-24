interface Totals {
  for: number;
  against: number;
  games: number;
  gamesAsRed: number;
  wins: number;
  losses: number;
  gamesToday: number;
}

interface Player {
  name: string;
  rank: number;
  active: boolean;
  skill: number;
  overrated: number;
  total: Totals;
  games: {href: string},
}
export default Player;
