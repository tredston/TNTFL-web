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
    return (
      <div>
        <NavigationBar
          base={base}
        />
        <div className={'ladder-page'}>
          <div className={'ladder-panel'}>
            <LadderPanel entries={entries} />
          </div>
          <div className={'side-panel'}>
            <RecentGames games={recentGames} showAllGames={false} base={base}/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <IndexPage
    base={__tntfl_base_path__}
  />,
  document.getElementById('entry'),
);
