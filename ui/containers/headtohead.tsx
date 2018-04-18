import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { GamesApi, Game } from 'tntfl-api';
import '../styles/style.less';

import HeadToHeadChart from '../components/head-to-head/head-to-head-chart';
import Stats from './head-to-head-stats';
import GoalDistributionChart from '../components/head-to-head/goal-distribution-chart';
import NavigationBar from '../components/navigation-bar';
import RecentGames from '../components/recent-game-list';
import { getParameters, mostRecentGames } from '../utils/utils';

interface HeadToHeadPageProps extends Props<HeadToHeadPage> {
  base: string;
  player1: string;
  player2: string;
}
interface HeadToHeadPageState {
  games?: Game[];
}
class HeadToHeadPage extends Component<HeadToHeadPageProps, HeadToHeadPageState> {
  constructor(props: HeadToHeadPageProps, context: any) {
    super(props, context);
    this.state = {
      games: undefined,
    };
  }
  async loadGames() {
    const { base, player1, player2 } = this.props;
    const api = new GamesApi(fetch, base);
    const games = await api.getHeadToHeadGames({player1, player2});
    this.setState({games} as HeadToHeadPageState);
  }
  componentDidMount() {
    this.loadGames();
  }
  render() {
    const { base, player1, player2 } = this.props;
    const { games } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
        />
        {games ?
          <Grid fluid={true}>
            <Col md={8}>
              <Stats player1={player1} player2={player2} games={games} base={base}/>
              <Panel>
                <Panel.Body>
                  <HeadToHeadChart player1={player1} player2={player2} games={games}/>
                </Panel.Body>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel>
                <Panel.Heading><h2>Goal Distribution</h2></Panel.Heading>
                <Panel.Body>
                  <GoalDistributionChart player1={player1} player2={player2} games={games}/>
                </Panel.Body>
              </Panel>
              <RecentGames games={mostRecentGames(games)} showAllGames={true} base={base}/>
            </Col>
          </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
}

ReactDOM.render(
  <HeadToHeadPage
    base={__tntfl_base_path__}
    player1={getParameters(2)[0]}
    player2={getParameters(2)[1]}
  />,
  document.getElementById('entry'),
);
