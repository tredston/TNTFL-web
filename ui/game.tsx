import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import 'whatwg-fetch';

import GameSummary from './components/game-summary';
import GameDetails from './components/game-details';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';
import { getParameters } from './utils/utils';

interface GamePageProps extends Props<GamePage> {
  base: string;
  addURL: string;
  gameId: string;
}
interface GamePageState {
  game: Game;
  punditry: string[];
  activePlayers: {[key: number]: number};
}
class GamePage extends Component<GamePageProps, GamePageState> {
  constructor(props: GamePageProps, context: any) {
    super(props, context)
    this.state = {
      game: undefined,
      punditry: undefined,
      activePlayers: undefined,
    };
  }
  async loadGame() {
    const { base, gameId } = this.props;
    const url = `${base}game/${gameId}/json`;
    const r = await fetch(url);
    this.setState({game: await r.json()} as GamePageState);
  }
  async loadPunditry() {
    const { base, gameId } = this.props;
    const url = `${base}pundit/${gameId}/json`;
    const r = await fetch(url);
    this.setState({punditry: await r.json()} as GamePageState);
  }
  async loadActivePlayers() {
    const { base, gameId } = this.props;
    const url = `${base}activeplayers.cgi?at=${+gameId - 1}`;
    const r = await fetch(url);
    this.setState({activePlayers: await r.json()} as GamePageState);
  }
  componentDidMount() {
    this.loadGame();
    this.loadPunditry();
    this.loadActivePlayers();
  }
  render() {
    const { base, addURL } = this.props;
    const { activePlayers } = this.state;
    const numActivePlayers: number = activePlayers && activePlayers[Number(Object.keys(activePlayers)[0])];
    return (
      <div className="gamePage">
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        {this.state.game ?
          <Grid fluid={true}>
            <Panel>
              <Row>
                <GameSummary game={this.state.game} base={"../../"} numActivePlayers={numActivePlayers} />
              </Row>
              <Row>
                <GameDetails game={this.state.game} punditry={this.state.punditry}/>
              </Row>
            </Panel>
          </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
};

ReactDOM.render(
    <GamePage
      base={'../../'}
      addURL={'game/add'}
      gameId={getParameters(1)[0]}
    />,
    document.getElementById('entry')
);
