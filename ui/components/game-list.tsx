import * as React from 'react';
import { Component, Props } from 'react';
import { Game, GamesApi, PlayersApi } from 'tntfl-api';

import GameSummary from './game-summary';

interface GameListProps extends Props<GameList> {
  games: Game[];
}
interface State {
  activePlayers?: Map<number, number>;
  punditry?: Map<number, string[]>;
}
export default class GameList extends Component<GameListProps, State> {
  constructor(props: GameListProps, context: any) {
    super(props, context);
    this.state = {
      activePlayers: undefined,
    };
  }
  async loadPunditry() {
    const { games } = this.props;
    if (games.length > 0) {
      const at = games.map((game) => game.date).join(',');
      const json = await new GamesApi(undefined, '', fetch).getPunditry(at);
      const punditry = Object.keys(json).reduce((acc, cur) => acc.set(+cur, json[cur].facts), new Map<number, string[]>());
      this.setState({punditry});
    }
  }
  async loadActivePlayers() {
    const { games } = this.props;
    if (games.length > 0) {
      const at = games.map((game) => game.date - 1).join(',');
      const json: {[key: string]: {count: number}} = await new PlayersApi(undefined, '', fetch).getActive(at);
      const activePlayers = Object.keys(json).reduce((acc, cur) => acc.set(+cur, json[cur].count), new Map<number, number>());
      this.setState({activePlayers});
    }
  }
  componentDidMount() {
    this.loadPunditry();
    this.loadActivePlayers();
  }
  componentDidUpdate(prevProps: GameListProps, prevState: State) {
    if (this.props.games !== prevProps.games) {
      this.loadPunditry();
      this.loadActivePlayers();
    }
  }
  render(): JSX.Element {
    const { games } = this.props;
    const { activePlayers, punditry } = this.state;
    return (
      <>
        {games.map((game) =>
          <GameSummary
            game={game}
            numActivePlayers={(activePlayers && activePlayers.get(game.date - 1)) || 0}
            punditry={punditry && punditry.get(game.date)}
            key={`${game.date}`}
          />,
        )}
      </>
    );
  }
}
