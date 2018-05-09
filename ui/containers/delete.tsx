import * as React from 'react';
import { Component, Props } from 'react';
import { Button, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Game, GamesApi, PlayersApi } from 'tntfl-api';
import '../styles/achievement.less';
import '../styles/style.less';

import GameSummary from '../components/game-summary';
import NavigationBar from '../components/navigation-bar';
import { getParameters } from '../utils/utils';

interface DeletePageProps extends Props<DeletePage> {
  base: string;
  gameId: string;
}
interface DeletePageState {
  game?: Game;
  activePlayers?: number;
}
class DeletePage extends Component<DeletePageProps, DeletePageState> {
  state = {
    game: undefined,
    activePlayers: undefined,
  };

  async loadGame() {
    const { base, gameId } = this.props;
    const api = new GamesApi(fetch, base);
    const game = await api.getGame({gameId: +gameId});
    this.setState({game} as DeletePageState);
  }
  async loadActivePlayers() {
    const { base, gameId } = this.props;
    const api = new PlayersApi(fetch, base);
    const at = `${+gameId - 1}`;
    const activePlayers: {[key: string]: {count: number}} = await api.getActive({at});
    this.setState({activePlayers: activePlayers[Number(Object.keys(activePlayers)[0])].count});
  }
  componentDidMount() {
    this.loadGame();
    this.loadActivePlayers();
  }
  render() {
    const { base } = this.props;
    const { game, activePlayers } = this.state;
    const numActivePlayers = activePlayers || 0;
    return (
      <div className='gamePage'>
        <NavigationBar
          base={base}
        />
        {game ?
          <div className={'page-container'}>
            <Panel>
              <Panel.Body>
                <div>
                  <div style={{maxWidth: '60%', margin: 'auto'}}>
                    <Panel bsStyle={'danger'}>
                      <Panel.Heading>Delete Game</Panel.Heading>
                      <Panel.Body>
                        <p>Are you sure you wish to delete this game?</p>
                        <Button href='javascript:history.go(-1);'>No, I'd rather not</Button> <Button bsStyle='danger' href='?deleteConfirm=true'>Yes, delete it</Button>
                      </Panel.Body>
                    </Panel>
                  </div>
                </div>
                <div>
                  <GameSummary game={game} base={'../../'} numActivePlayers={numActivePlayers} />
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
    <DeletePage
      base={__tntfl_base_path__}
      gameId={getParameters(2)[0]}
    />,
    document.getElementById('entry'),
);
