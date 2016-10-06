import * as React from 'react';
import { Component, Props } from 'react';
import * as ReactDOM from 'react-dom';
import * as request from 'request';

import GameSummary from './components/game-summary';
import GameDetails from './components/game-details';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';

interface GamePageProps extends Props<GamePage> {
  pageHeader: string;
  source: string;
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
    const { source } = this.props;
    request.get(source, (e, r, b) => this.setState({game: JSON.parse(b)}));
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { pageHeader, addURL, onGameAdded } = this.props;
    const numActivePlayers = 0;
    console.log(this.state.game);
    return (
      <div className="gamePage">
        <NavigationBar
          header={pageHeader}
          addURL={addURL}
          onGameAdded={onGameAdded}
        />
        <div className="container-fluid">
          <div className="row">
            {this.state.game ? <GameSummary game={this.state.game} base={"../../"} numActivePlayers={numActivePlayers} /> : "Loading"}
          </div>
          <div className="row">
            {this.state.game ? <GameDetails game={this.state.game} /> : "Loading"}
          </div>
        </div>
      </div>
    );
  }
};

ReactDOM.render(
    <GamePage
      pageHeader={'Game'}
      source={'https://www.int.corefiling.com/~tlr/tntfl-test/game.cgi?method=view&view=json&game=1475674529'}
      addURL={'add'}
      onGameAdded={() => undefined}
    />,
    document.getElementById('entry')
);
