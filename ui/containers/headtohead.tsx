import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Game, GamesApi } from 'tntfl-api';
import '../styles/style.less';

import HeadToHeadChart from '../components/head-to-head/head-to-head-chart';
import Stats from './head-to-head-stats';
import GoalDistributionChart from '../components/head-to-head/goal-distribution-chart';
import NavigationBar from '../components/navigation-bar';
import RecentGames from '../components/recent-game-list';
import { getParameters, mostRecentGames } from '../utils/utils';

interface HeadToHeadPageProps extends Props<HeadToHeadPage> {
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
    const { player1, player2 } = this.props;
    const games = await new GamesApi(undefined, '', fetch).getHeadToHeadGames(player1, player2);
    this.setState({games} as HeadToHeadPageState);
  }
  componentDidMount() {
    this.loadGames();
  }
  render() {
    const { player1, player2 } = this.props;
    const { games } = this.state;
    return (
      <div>
        <NavigationBar/>
        {games ?
          <div className={'ladder-page'}>
            <div className={'ladder-panel'}>
              <Stats player1={player1} player2={player2} games={games} />
              <Panel>
                <Panel.Body>
                  <HeadToHeadChart player1={player1} player2={player2} games={games}/>
                </Panel.Body>
              </Panel>
            </div>
            <div className={'side-panel'}>
              <Panel>
                <Panel.Heading><h2>Goal Distribution</h2></Panel.Heading>
                <Panel.Body>
                  <GoalDistributionChart player1={player1} player2={player2} games={games}/>
                </Panel.Body>
              </Panel>
              <RecentGames games={mostRecentGames(games)} showAllGames={true} />
            </div>
          </div>
          : 'Loading...'
        }
      </div>
    );
  }
}

ReactDOM.render(
  <HeadToHeadPage
    player1={getParameters(2)[0]}
    player2={getParameters(2)[1]}
  />,
  document.getElementById('entry'),
);
