import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import 'whatwg-fetch';

import GameSummary from '../components/game-summary';
import GameDetails from '../components/game-details';
import NavigationBar from '../components/navigation-bar';
import Game from '../model/game';
import { getParameters } from '../utils/utils';

interface DeletePageProps extends Props<DeletePage> {
  base: string;
  addURL: string;
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
    const url = `${base}game/${gameId}/json`;
    const r = await fetch(url);
    this.setState({game: await r.json()} as DeletePageState);
  }
  async loadActivePlayers() {
    const { base, gameId } = this.props;
    const url = `${base}activeplayers.cgi?at=${+gameId - 1}`;
    const r = await fetch(url);
    const activePlayers: {[key: number]: number} = await r.json();
    this.setState({activePlayers: activePlayers[Number(Object.keys(activePlayers)[0])]});
  }
  componentDidMount() {
    this.loadGame();
    this.loadActivePlayers();
  }
  render() {
    const { base, addURL } = this.props;
    const { game, activePlayers } = this.state;
    const numActivePlayers = activePlayers || 0;
    return (
      <div className='gamePage'>
        <NavigationBar
          base={base}
          addURL={addURL}
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
};

ReactDOM.render(
    <DeletePage
      base={'../../'}
      addURL={'game/add'}
      gameId={getParameters(2)[0]}
    />,
    document.getElementById('entry'),
);
