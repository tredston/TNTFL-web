import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { GamesApi, PlayersApi, Game } from 'tntfl-api';
import 'whatwg-fetch';

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
          <Grid fluid={true}>
            <Panel>
              <Row>
                <Col md={8} mdOffset={2}>
                  <Panel header={'Delete Game'}>
                    <p>Are you sure you wish to delete this game?</p>
                    <a href='javascript:history.go(-1);' className='btn btn-default'>No, I'd rather not</a> <a className='btn btn-danger' href='?deleteConfirm=true'>Yes, delete it</a>
                  </Panel>
                </Col>
              </Row>
              <Row>
                <GameSummary game={game} base={'../../'} numActivePlayers={numActivePlayers} />
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
    <DeletePage
      base={'../../'}
      gameId={getParameters(2)[0]}
    />,
    document.getElementById('entry'),
);
