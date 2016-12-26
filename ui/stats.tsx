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

interface StatsProps {
  totals: Totals;
}
function Stats(props: StatsProps): JSX.Element {
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

interface RecordProps {
  records: Records;
  base: string;
}
function Records(props: RecordProps): JSX.Element {
  const { records, base } = props;
  const player = records.winningStreak.player;
  return (
    <Panel header={'Records'}>
    <dt>Longest winning streak</dt>
      <dd><b>{records.winningStreak.count}</b> (<a href={`${base}player/${player}`}>{player}</a>)</dd>
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

interface AchievementProps {
  achievement: Achievement;
  count: number;
}
function Achievement(props: AchievementProps): JSX.Element {
  const { achievement, count } = props;
  const icon = "achievement-" + achievement.name.replace(/ /g, '');
  const iconStyle = {width: 100, textAlign: 'center'};
  return (
    <Panel header={achievement.name}>
      <div className={icon} style={iconStyle}/>
      {`${achievement.description} - ${count}`}
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
      {achievements.map((a, i) => <Achievement achievement={a[0]} count={a[1]} key={`${i}`}/>)}
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
                <Stats totals={stats.totals}/>
                <Records records={stats.records} base={base}/>
              </Col>
              <Col md={4}>
              </Col>
              <Panel header={'Most Significant Games'}>
                <GameList games={stats.records.mostSignificant} base={base} />
              </Panel>
              <Col md={4}>
                <Panel header={'Least Significant Games'}>
                  <GameList games={stats.records.leastSignificant} base={base} />
                </Panel>
              </Col>
            </Row>
            <Row>
              <Panel header={'Games Per Day'}>
                <GamesPerDay gamesPerDay={stats.gamesPerDay} />
              </Panel>
            </Row>
            <Row>
              <Achievements achievements={stats.totals.achievements}/>
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
