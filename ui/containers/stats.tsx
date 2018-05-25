import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Stats, StatsApi } from 'tntfl-api';
import '../styles/achievement.less';
import '../styles/style.less';

import GameList from '../components/game-list';
import NavigationBar from '../components/navigation-bar';
import StatsSection from '../components/stats/stats-section';
import BeltSection from '../components/stats/belt-section';
import RecordsSection from '../components/stats/records-section';
import GamesPerWeek from '../components/stats/games-per-week';
import Achievements from '../components/stats/achievements';

interface StatsPageProps extends Props<StatsPage> {
}
interface StatsPageState {
  stats?: Stats;
}
export default class StatsPage extends Component<StatsPageProps, StatsPageState> {
  constructor(props: StatsPageProps, context: any) {
    super(props, context);
    this.state = {
      stats: undefined,
    };
  }
  async load() {
    const stats = await new StatsApi(undefined, '', fetch).getStats();
    this.setState({stats});
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { stats } = this.state;
    return (
      <div>
        <NavigationBar/>
        {stats
          ? <div>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 20, marginRight: 20}}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{width: 'calc((100vw - 80px) / 3)', marginRight: 20}}>
                  <BeltSection belt={stats.belt} />
                  <RecordsSection records={stats.records}/>
                  <StatsSection totals={stats.totals}/>
                </div>
                <div style={{width: 'calc((100vw - 80px) / 3)', marginRight: 20}}>
                  <Panel>
                    <Panel.Heading>Most Significant Games</Panel.Heading>
                    <Panel.Body>
                      <GameList games={stats.records.mostSignificant} />
                    </Panel.Body>
                  </Panel>
                </div>
                <div style={{width: 'calc((100vw - 80px) / 3)'}}>
                  <Panel>
                    <Panel.Heading>Least Significant Games</Panel.Heading>
                    <Panel.Body>
                      <GameList games={stats.records.leastSignificant} />
                    </Panel.Body>
                  </Panel>
                </div>
              </div>
              <Panel>
                <Panel.Heading>Games Per Week</Panel.Heading>
                <Panel.Body>
                  <GamesPerWeek gamesPerWeek={stats.gamesPerWeek} />
                </Panel.Body>
              </Panel>
              <Achievements achievements={stats.totals.achievements}/>
            </div>
          </div>
        : 'Loading...'
      }
      </div>
    );
  }
}

ReactDOM.render(
  <StatsPage/>,
  document.getElementById('entry'),
);
