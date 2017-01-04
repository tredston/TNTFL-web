import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';

import GameList from './components/game-list';
import NavigationBar from './components/navigation-bar';
import Achievement from './model/achievement';
import Game from './model/game';
import Stats, { Totals, Records } from './model/stats';
import { formatEpoch } from './utils/utils';

interface StatsSectionProps {
  totals: Totals;
}
function StatsSection(props: StatsSectionProps): JSX.Element {
  const { totals } = props;
  return (
    <Panel header={'Stats'}>
      <dl className='dl-horizontal'>
        <dt>Total games</dt>
        <dd>{totals.games}</dd>
        <dt>Total players</dt>
        <dd>{totals.players}</dd>
        <dt>Active players</dt>
        <dd>{`${totals.activePlayers} (${(totals.activePlayers / totals.players).toFixed(2)}%)`}</dd>
      </dl>
    </Panel>
  );
}

interface RecordsSectionProps {
  records: Records;
  base: string;
}
function RecordsSection(props: RecordsSectionProps): JSX.Element {
  const { records, base } = props;
  const player = records.winningStreak.player;
  return (
    <Panel header={'Records'}>
      <dl className='dl-horizontal'>
        <dt style={{whiteSpace: 'normal'}}>Longest winning streak</dt>
        <dd><b>{records.winningStreak.count}</b> (<a href={`${base}player/${player}`}>{player}</a>)</dd>
      </dl>
    </Panel>
  );
}

interface GamesPerDayProps {
  gamesPerDay: [number, number][];
}
function GamesPerDay(props: GamesPerDayProps): JSX.Element {
  const { gamesPerDay } = props;
  const data = {datasets: [{
    data: gamesPerDay.map(d => {return {x: d[0] * 1000, y: d[1]}}),
    fill: false,
    borderColor: '#0000FF',
  }]};
  const options = {
    scales: {xAxes: [{
      type: 'time',
      time: {
        minUnit: 'minute',
      }
    }]},
    legend: {display: false},
    tooltips: {callbacks: {
      title: (tooltip: any, point: any) => formatEpoch(tooltip[0].xLabel / 1000),
      label: (tooltip: any, point: any) => tooltip.yLabel.toFixed(3),
    }},
    animation: false,
  };
  return (
    <Line data={data} options={options}/>
  );
}

interface AchievementPanelProps {
  achievement: Achievement;
  count: number;
}
function AchievementPanel(props: AchievementPanelProps): JSX.Element {
  const { achievement, count } = props;
  const icon = "achievement-" + achievement.name.replace(/ /g, '');
  return (
    <Panel header={achievement.name} style={{textAlign: 'center'}}>
      <div className={icon} style={{margin: 'auto'}}/>
      {achievement.description} - <b>{count}</b>
    </Panel>
  );
}

interface AchievementsProps {
  achievements: [Achievement, number][];
}
function Achievements(props: AchievementsProps): JSX.Element {
  const { achievements } = props;
  return (
    <Panel header={'Achievements'}>
      {achievements.map((a, i) => <Col xs={3} key={`${i}`}><AchievementPanel achievement={a[0]} count={a[1]}/></Col>)}
    </Panel>
  );
}

interface StatsPageProps extends Props<StatsPage> {
  base: string;
  addURL: string;
}
interface StatsPageState {
  stats: Stats;
}
export default class StatsPage extends Component<StatsPageProps, StatsPageState> {
  constructor(props: StatsPageProps, context: any) {
    super(props, context);
    this.state = {
      stats: undefined,
    }
  }
  async load() {
    const { base } = this.props;
    let url = `${base}stats.cgi?view=json`;
    const r = await fetch(url);
    this.setState({stats: await r.json()});
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { addURL, base } = this.props;
    const { stats } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        {stats
          ? <Grid fluid={true}>
            <Row>
              <Col md={4}>
                <StatsSection totals={stats.totals}/>
                <RecordsSection records={stats.records} base={base}/>
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
                <Panel header={'Games Per Day'}>
                  <GamesPerDay gamesPerDay={stats.gamesPerDay} />
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
    addURL={'game/add'}
  />,
  document.getElementById('entry')
);
