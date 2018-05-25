import * as React from 'react';
import { Component, Props } from 'react';
import * as ReactDOM from 'react-dom';
import { Game, GamesApi, LadderApi, LadderEntry } from 'tntfl-api';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import '../styles/style.less';

import RecentGames from '../components/recent-game-list';
import NavigationBar from '../components/navigation-bar';
import LadderPanel from '../components/ladder-panel';

interface IndexPageProps extends Props<IndexPage> {
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
    const entries = await new LadderApi(undefined, '', fetch).getLadder(1, 1);
    this.setState({entries} as IndexPageState);
  }
  async loadRecent() {
    const recentGames = await new GamesApi(undefined, '', fetch).getRecent();
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
    const { entries, recentGames } = this.state;
    return (
      <div>
        <NavigationBar/>
        <div className={'ladder-page'}>
          <div className={'ladder-panel'}>
            <LadderPanel entries={entries} />
          </div>
          <div className={'side-panel'}>
            <RecentGames games={recentGames} showAllGames={false} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <IndexPage/>,
  document.getElementById('entry'),
);
