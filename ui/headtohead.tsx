import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import Graph from './components/head-to-head-graph';
import GoalDistribution from './components/goal-distribution';
import NavigationBar from './components/navigation-bar';
import RecentGames from './components/recent-game-list';
import Game from './model/game';
import { getParameterByName } from './utils/utils';

interface HeadToHeadStatsProps {
  games: Game[];
}
function HeadToHeadStats(props: HeadToHeadStatsProps): JSX.Element {
  return (
    <Panel header={'Statistics'}>
      Points Swing
      Wins
      10-0 Wins
      Goals
      Predicted Result
    </Panel>
  );
}

interface HeadToHeadPageProps extends Props<HeadToHeadPage> {
  root: string;
  addURL: string;
  player1: string;
  player2: string;
}
interface HeadToHeadPageState {
  games: Game[];
}
class HeadToHeadPage extends Component<HeadToHeadPageProps, HeadToHeadPageState> {
  constructor(props: HeadToHeadPageProps, context: any) {
    super(props, context);
    this.state = {
      games: undefined,
    };
  }
  async loadGames() {
    const { root, player1, player2 } = this.props;
    const url = `${root}headtohead.cgi?method=games&view=json&player1=${player1}&player2=${player2}`;
    const r = await fetch(url);
    this.setState({games: await r.json()} as HeadToHeadPageState);
  }
  componentDidMount() {
    this.loadGames();
  }
  render() {
    const { root, addURL, player1, player2 } = this.props;
    const { games } = this.state;
    const numActivePlayers = 0;
    // getTotalActivePlayers(this.state.playersStats)
    return (
      <div className="playerPage">
        <NavigationBar
          root={root}
          addURL={addURL}
        />
        {games ?
          <Grid fluid={true}>
            <Panel header={'Head to Head'}>
              <Row>
                <Col md={8}>
                  <HeadToHeadStats games={games}/>
                  <Graph player1={player1} player2={player2} games={games}/>
                </Col>
                <Col md={4}>
                  <GoalDistribution player1={player1} player2={player2} games={games}/>
                  <RecentGames games={games.slice(games.length - 5).reverse()} showAllGames={true}/>
                </Col>
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
  <HeadToHeadPage
    root={'http://www/~tlr/tntfl-test/'}
    addURL={'game/add'}
    player1={getParameterByName('player1')}
    player2={getParameterByName('player2')}
  />,
  document.getElementById('entry')
);
