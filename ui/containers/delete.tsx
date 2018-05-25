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
    const { gameId } = this.props;
    const game = await new GamesApi(undefined, '', fetch).getGame(+gameId);
    this.setState({game} as DeletePageState);
  }
  async loadActivePlayers() {
    const { gameId } = this.props;
    const at = `${+gameId - 1}`;
    const activePlayers = await new PlayersApi(undefined, '', fetch).getActive(at);
    this.setState({activePlayers: activePlayers[Number(Object.keys(activePlayers)[0])].count});
  }
  componentDidMount() {
    this.loadGame();
    this.loadActivePlayers();
  }
  render() {
    const { game, activePlayers } = this.state;
    const numActivePlayers = activePlayers || 0;
    return (
      <div className='gamePage'>
        <NavigationBar/>
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
                        <Button href='javascript:history.go(-1);'>No, I'd rather not</Button> <Button bsStyle='danger' href={`${window.location.href}/json`}>Yes, delete it</Button>
                      </Panel.Body>
                    </Panel>
                  </div>
                </div>
                <div>
                  <GameSummary game={game} numActivePlayers={numActivePlayers} />
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
      gameId={getParameters(2)[0]}
    />,
    document.getElementById('entry'),
);
