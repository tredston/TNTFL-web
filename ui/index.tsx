import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import RecentGames from './components/recent-game-list';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';

import Ladder from './components/ladder';
import LadderEntry from './model/ladder-entry';

interface IndexPageProps extends Props<IndexPage> {
  base: string;
  addURL: string;
}
interface IndexPageState {
  entries: LadderEntry[];
  recentGames: Game[];
  showInactive: boolean;
}
export default class IndexPage extends Component<IndexPageProps, IndexPageState> {
  constructor(props: IndexPageProps, context: any) {
    super(props, context);
    this.state = {
      entries: undefined,
      recentGames: [],
      showInactive: false,
    }
  }
  async loadLadder(showInactive: boolean) {
    const { base } = this.props;
    let url = `${base}ladder.cgi?view=json&players=1`;
    if (showInactive === true) {
      url += '&showInactive=1';
    }
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
    this.loadLadder(this.state.showInactive);
    this.loadRecent();
    setInterval(function() {
      this.loadLadder(this.state.showInactive);
      this.loadRecent();
    }.bind(this), 600000);
  }
  onShowInactive() {
    const newState = !this.state.showInactive;
    this.setState({showInactive: newState} as IndexPageState);
    this.loadLadder(newState);
  }
  render() {
    const { addURL, base } = this.props;
    const { entries, recentGames, showInactive } = this.state;
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
              <Panel>
                {entries
                  ? <div>
                      <Ladder entries={entries} atDate={now}/>
                      <Button onClick={() => this.onShowInactive()} style={{width: '100%'}}>
                        {showInactive ? 'Hide inactive' : 'Show inactive'}
                      </Button>
                    </div>
                  : 'Loading...'
                }
              </Panel>
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
