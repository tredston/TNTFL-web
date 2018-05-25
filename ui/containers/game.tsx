import * as React from 'react';
import { Component, Props } from 'react';
import * as ReactDOM from 'react-dom';
import { Panel } from 'react-bootstrap';
import { Game } from 'tntfl-api';
import '../styles/achievement.less';
import '../styles/style.less';

import { gamesApi, playersApi } from '../clients/tntfl';
import GameSummary from '../components/game-summary';
import GameDetails from '../components/game-details';
import NavigationBar from '../components/navigation-bar';
import { getParameters } from '../utils/utils';

interface GamePageProps extends Props<GamePage> {
  gameId: string;
}
interface GamePageState {
  game?: Game;
  punditry?: string[];
  activePlayers?: number;
}
class GamePage extends Component<GamePageProps, GamePageState> {
  state = {
    game: undefined,
    punditry: undefined,
    activePlayers: undefined,
  };

  async loadGame() {
    const { gameId } = this.props;
    const game = await gamesApi().getGame(+gameId);
    this.setState({game});
  }
  async loadPunditry() {
    const { gameId } = this.props;
    const punditry = await gamesApi().getPunditry(gameId);
    this.setState({punditry: punditry[Object.keys(punditry)[0]].facts});
  }
  async loadActivePlayers() {
    const { gameId } = this.props;
    const activePlayers = await playersApi().getActive(`${+gameId - 1}`);
    this.setState({activePlayers: activePlayers[Object.keys(activePlayers)[0]].count});
  }
  componentDidMount() {
    this.loadGame();
    this.loadPunditry();
    this.loadActivePlayers();
  }
  render() {
    const { game, punditry, activePlayers } = this.state;
    const numActivePlayers = activePlayers || 0;
    return (
      <div className='gamePage'>
        <NavigationBar/>
        {game ?
          <div className={'page-container'}>
            <Panel>
              <Panel.Body>
                <div>
                  <GameSummary game={game} numActivePlayers={numActivePlayers} />
                </div>
                <div>
                  <GameDetails game={game} punditry={punditry}/>
                </div>
              </Panel.Body>
            </Panel>
          </div>
          : 'Loading...'
        }
      </div>
    );
  }
}

ReactDOM.render(
    <GamePage
      gameId={getParameters(1)[0]}
    />,
    document.getElementById('entry'),
);
