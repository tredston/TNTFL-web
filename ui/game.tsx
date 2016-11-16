import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import 'whatwg-fetch';

import GameSummary from './components/game-summary';
import GameDetails from './components/game-details';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';
import { getParameterByName } from './utils/utils';

interface GamePageProps extends Props<GamePage> {
  base: string;
  addURL: string;
  gameId: string;
}
interface GamePageState {
  game: Game;
  punditry: string[];
}
class GamePage extends Component<GamePageProps, GamePageState> {
  constructor(props: GamePageProps, context: any) {
    super(props, context)
    this.state = {
      game: undefined,
      punditry: undefined,
    };
  }
  async loadGame() {
    const { base, gameId } = this.props;
    const url = `${base}game.cgi?method=view&view=json&game=${gameId}`;
    const r = await fetch(url);
    this.setState({game: await r.json()} as GamePageState);
  }
  async loadPunditry() {
    const { base, gameId } = this.props;
    const url = `${base}pundit.cgi?game=${gameId}`;
    const r = await fetch(url);
    this.setState({punditry: await r.json()} as GamePageState);
  }
  componentDidMount() {
    this.loadGame();
    this.loadPunditry();
  }
  render() {
    const { base, addURL } = this.props;
    //TODO
    const numActivePlayers = 0;
    return (
      <div className="gamePage">
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        {this.state.game ?
          <Grid fluid={true}>
            <Row>
              <GameSummary game={this.state.game} base={"../../"} numActivePlayers={numActivePlayers} />
            </Row>
            <Row>
              <GameDetails game={this.state.game} punditry={this.state.punditry}/>
            </Row>
          </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
};

ReactDOM.render(
    <GamePage
      base={''}
      addURL={'game/add'}
      gameId={getParameterByName('game')}
    />,
    document.getElementById('entry')
);
