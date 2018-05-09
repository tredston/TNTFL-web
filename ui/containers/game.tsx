import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Game, GamesApi, PlayersApi } from 'tntfl-api';
import '../styles/achievement.less';
import '../styles/style.less';

import GameSummary from '../components/game-summary';
import GameDetails from '../components/game-details';
import NavigationBar from '../components/navigation-bar';
import { getParameters } from '../utils/utils';

interface GamePageProps extends Props<GamePage> {
  base: string;
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
    const { base, gameId } = this.props;
    const api = new GamesApi(fetch, base);
    const game = await api.getGame({gameId: +gameId});
    this.setState({game});
  }
  async loadPunditry() {
    const { base, gameId } = this.props;
    const api = new GamesApi(fetch, base);
    const punditry = await api.getPunditry({at: gameId});
    this.setState({punditry: punditry[Object.keys(punditry)[0]].facts});
  }
  async loadActivePlayers() {
    const { base, gameId } = this.props;
    const activePlayers = await new PlayersApi(fetch, base).getActive({at: `${+gameId - 1}`});
    this.setState({activePlayers: activePlayers[Object.keys(activePlayers)[0]].count});
  }
  componentDidMount() {
    this.loadGame();
    this.loadPunditry();
    this.loadActivePlayers();
  }
  render() {
    const { base } = this.props;
    const { game, punditry, activePlayers } = this.state;
    const numActivePlayers = activePlayers || 0;
    return (
      <div className='gamePage'>
        <NavigationBar
          base={base}
        />
        {game ?
          <Grid fluid={true}>
            <Panel>
              <Row>
                <GameSummary game={game} base={'../../'} numActivePlayers={numActivePlayers} />
              </Row>
              <Row>
                <GameDetails game={game} punditry={punditry}/>
              </Row>
            </Panel>
          </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
}

ReactDOM.render(
    <GamePage
      base={__tntfl_base_path__}
      gameId={getParameters(1)[0]}
    />,
    document.getElementById('entry'),
);
