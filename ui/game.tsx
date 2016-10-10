import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import * as request from 'request';

import GameSummary from './components/game-summary';
import GameDetails from './components/game-details';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';

interface GamePageProps extends Props<GamePage> {
  root: string;
  gameId: string;
  addURL: string;
  onGameAdded: () => void;
}
interface GamePageState {
  game: Game;
}
class GamePage extends Component<GamePageProps, GamePageState> {
  constructor(props: GamePageProps, context: any) {
    super(props, context)
    this.state = {
      game: undefined,
    };
  }
  load() {
    const { root, gameId } = this.props;
    request.get(`${root}game.cgi?method=view&view=json&game=${gameId}`, (e, r, b) => this.setState({game: JSON.parse(b)}));
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { root, addURL, onGameAdded } = this.props;
    //TODO
    const numActivePlayers = 0;
    return (
      <div className="gamePage">
        <NavigationBar
          root={root}
          addURL={addURL}
          onGameAdded={onGameAdded}
        />
        {this.state.game ?
          <Grid fluid={true}>
            <Row>
              <GameSummary game={this.state.game} base={"../../"} numActivePlayers={numActivePlayers} />
            </Row>
            <Row>
              <GameDetails game={this.state.game} />
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
      root={'www/~tlr/tntfl-test/'}
      gameId={'1475674529'}
      addURL={'add'}
      onGameAdded={() => undefined}
    />,
    document.getElementById('entry')
);
