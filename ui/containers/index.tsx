import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import RecentGames from '../components/recent-game-list';
import NavigationBar from '../components/navigation-bar';
import Game from '../model/game';

import LadderPanel from '../components/ladder-panel';
import LadderEntry from '../model/ladder-entry';

interface IndexPageProps extends Props<IndexPage> {
  base: string;
  addURL: string;
}
interface IndexPageState {
  entries: LadderEntry[];
  recentGames: Game[];
}
export default class IndexPage extends Component<IndexPageProps, IndexPageState> {
  constructor(props: IndexPageProps, context: any) {
    super(props, context);
    this.state = {
      entries: undefined,
      recentGames: [],
    }
  }
  async loadLadder() {
    const { base } = this.props;
    let url = `${base}ladder.cgi?view=json&players=1&showInactive=1`;
    const r = await fetch(url);
    this.setState({entries: await r.json()} as IndexPageState);
  }
  async loadRecent() {
    const { base } = this.props;
    const url = `${base}recent.cgi?view=json`;
    const r = await fetch(url);
    this.setState({recentGames: await r.json()} as IndexPageState);
  }
  componentDidMount() {
    this.loadLadder();
    this.loadRecent();
    setInterval(function() {
      this.loadLadder();
      this.loadRecent();
    }.bind(this), 600000);
  }
  render() {
    const { addURL, base } = this.props;
    const { entries, recentGames } = this.state;
    const now = (new Date()).getTime() / 1000;
    return (
      <div>
        <NavigationBar
          base={base}
          addURL={addURL}
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
    base={''}
    addURL={'game/add'}
  />,
  document.getElementById('entry')
);
