import * as React from 'react';
import { Component, Props } from 'react';
import { Grid } from 'react-bootstrap';

import Game from '../model/game';
import GameSummary from './game-summary';

interface GameListProps extends Props<GameList> {
  games: Game[];
  base: string;
}
interface State {
  activePlayers: {[key: number]: number};
}
export default class GameList extends Component<GameListProps, State> {
  constructor(props: GameListProps, context: any) {
    super(props, context);
    this.state = {
      activePlayers: undefined,
    };
  }
  async loadActivePlayers() {
    const { base, games } = this.props;
    const gameTimes = games.map((game) => game.date - 1);
    const url = `${base}activeplayers.cgi?at=${gameTimes.join(',')}`;
    const r = await fetch(url);
    this.setState({activePlayers: await r.json()} as State);
  }
  componentDidMount() {
    this.loadActivePlayers();
  }
  render(): JSX.Element {
    const { games, base } = this.props;
    const { activePlayers } = this.state;
    return (
      <Grid fluid={true}>
        {games.map((game) =>
          <GameSummary game={game} base={base} numActivePlayers={activePlayers && activePlayers[game.date - 1]} key={`${game.date}`}/>
        )}
      </Grid>
    );
  }
}
