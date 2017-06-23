import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { LadderApi, GamesApi, LadderEntry, Game } from 'tntfl-api';

import RecentGames from '../components/recent-game-list';
import NavigationBar from '../components/navigation-bar';

import LadderPanel from '../components/ladder-panel';

interface IndexPageProps extends Props<IndexPage> {
  base: string;
}
interface IndexPageState {
  entries?: LadderEntry[];
  recentGames: Game[];
}
export default class IndexPage extends Component<IndexPageProps, IndexPageState> {
  state = {
    entries: undefined,
    recentGames: [],
  };

  async loadLadder() {
    const base = '.';
    const api = new LadderApi(fetch, base);
    const entries = await api.getLadder({ showInactive: 1, players: 1 });
    this.setState({entries} as IndexPageState);
  }
  async loadRecent() {
    const base = '.';
    const api = new GamesApi(fetch, base);
    const recentGames = await api.getRecent({});
    this.setState({recentGames} as IndexPageState);
  }
  componentDidMount() {
    this.loadLadder();
    this.loadRecent();
    setInterval(() => {
      this.loadLadder();
      this.loadRecent();
    }, 600 * 1000);
  }
  render() {
    const { base } = this.props;
    const { entries, recentGames } = this.state;
    const now = (new Date()).getTime() / 1000;
    return (
      <div>
        <NavigationBar
          base={base}
        />
        <Grid fluid={true}>
          <Row>
            <Col lg={8}>
              <LadderPanel entries={entries} atDate={now} />
            </Col>
            <Col lg={4}>
              <RecentGames games={recentGames} showAllGames={false} base={base}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(
  <IndexPage
    base={'./'}
  />,
  document.getElementById('entry'),
);
