import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Stats, StatsApi } from 'tntfl-api';

import GameList from '../components/game-list';
import NavigationBar from '../components/navigation-bar';
import StatsSection from '../components/stats/stats-section';
import BeltSection from '../components/stats/belt-section';
import RecordsSection from '../components/stats/records-section';
import GamesPerWeek from '../components/stats/games-per-week';
import Achievements from '../components/stats/achievements';

interface StatsPageProps extends Props<StatsPage> {
  base: string;
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
    const { base } = this.props;
    const api = new StatsApi(fetch, base);
    const stats = await api.getStats();
    this.setState({stats});
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { base } = this.props;
    const { stats } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
        />
        {stats
          ? <Grid fluid={true}>
            <Row>
              <Col md={4}>
                <BeltSection belt={stats.belt} base={base} />
                <RecordsSection records={stats.records} base={base}/>
                <StatsSection totals={stats.totals}/>
              </Col>
              <Col md={4}>
                <Panel header={'Most Significant Games'}>
                  <GameList games={stats.records.mostSignificant} base={base} />
                </Panel>
              </Col>
              <Col md={4}>
                <Panel header={'Least Significant Games'}>
                  <GameList games={stats.records.leastSignificant} base={base} />
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Panel header={'Games Per Week'}>
                  <GamesPerWeek gamesPerWeek={stats.gamesPerWeek} />
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Achievements achievements={stats.totals.achievements}/>
              </Col>
            </Row>
          </Grid>
        : 'Loading...'
      }
      </div>
    );
  }
}

ReactDOM.render(
  <StatsPage
    base={'../'}
  />,
  document.getElementById('entry'),
);
