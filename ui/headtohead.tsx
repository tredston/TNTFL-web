import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Bar, Line } from 'react-chartjs-2';

import NavigationBar from './components/navigation-bar';
import RecentGames from './components/recent-game-list';
import Game from './model/game';
import Player from './model/player';
import { getParameterByName, getLadderLeagueClass, formatEpoch } from './utils/utils';

interface WinGraphProps {
  player1: string;
  player2: string;
  games: Game[];
}
function WinGraph(props: WinGraphProps): JSX.Element {
  const { player1, player2, games } = props;
  let player1Ahead = 0;
  const player1WinsAheadLine = games.map((game: Game) => {
    if (game.red.score !== game.blue.score) {
      if (
        (game.red.name == player1 && game.red.score > game.blue.score) ||
        (game.blue.name == player1 && game.blue.score > game.red.score)
      ) {
        player1Ahead += 1;
      }
      else {
        player1Ahead -= 1;
      }
    }
    return {x: game.date * 1000, y: player1Ahead};
  });
  let points = 0;
  const player1PointsAheadLine = games.map((game: Game) => {
    points += game.red.name == player1 ? game.red.skillChange : game.blue.skillChange;
    return {x: game.date * 1000, y: points};
  });

  const data = {datasets: [{
    label: `${player1} wins ahead`,
    data: player1WinsAheadLine,
    fill: false,
    borderColor: '#0000FF',
  },
  {
    label: `${player1} points gained`,
    data: player1PointsAheadLine,
    fill: false,
    borderColor: '#FF0000',
  }]};
  const options = {
    scales: {xAxes: [{type: 'time'}]},
    tooltips: {callbacks: {
      title: (tooltip: any, point: any) => formatEpoch(tooltip[0].xLabel / 1000),
      label: (tooltip: any, point: any) => tooltip.yLabel.toFixed(3),
    }}
  };
  return (
    <Panel header={<h1>{}</h1>}>
      <Line data={data} options={options}/>
    </Panel>
  );
}

interface HeadToHeadStatsProps {
  games: Game[];
}
function HeadToHeadStats(props: HeadToHeadStatsProps): JSX.Element {
  return (
    <Panel header={'Statistics'}>
      Points Swing
      Wins
      10-0 Wins
      Goals
      Predicted Result
    </Panel>
  );
}

interface GoalDistributionProps {
  player1: string;
  player2: string;
  games: Game[];
}
function GoalDistribution(props: GoalDistributionProps): JSX.Element {
  const { player1, player2, games } = props;
  function inc(data: any, score: number) {
    if (data[score] === undefined) {
      data[score] = 0;
    }
    data[score] += 1;
    return data;
  }
  let p1data: {[key: number]: number} = {};
  let p2data: {[key: number]: number} = {};
  games.forEach((game) => {
    if (game.red.name === player1) {
      p1data = inc(p1data, game.red.score)
      p2data = inc(p2data, game.blue.score)
    }
    else {
      p1data = inc(p1data, game.blue.score)
      p2data = inc(p2data, game.red.score)
    }
  });
  const maxGoals = games.reduce((pre, game) => Math.max(pre, game.red.score, game.blue.score), 0);
  const labels = [...Array(maxGoals).keys()];
  const p1hist = labels.map((score) => p1data[score] | 0);
  const p2hist = labels.map((score) => -p2data[score] | 0);
  const data = {
    labels,
    datasets: [
      {
        label: player1,
        data: p1hist,
        backgroundColor: '#FF0000',
      },
      {
        label: player2,
        data: p2hist,
        backgroundColor: '#0000FF',
      },
    ]
  };
  const options = {

  };
  return (
    <Panel header={'Goal Distribution'}>
      <Bar data={data} options={options}/>
    </Panel>
  );
}

interface HeadToHeadPageProps extends Props<HeadToHeadPage> {
  root: string;
  addURL: string;
  player1: string;
  player2: string;
}
interface HeadToHeadPageState {
  games: Game[];
}
class HeadToHeadPage extends Component<HeadToHeadPageProps, HeadToHeadPageState> {
  constructor(props: HeadToHeadPageProps, context: any) {
      super(props, context);
      this.state = {
        games: [],
      };
  }
  async loadGames() {
    const { root, player1, player2 } = this.props;
    const url = `${root}headtohead.cgi?method=games&view=json&player1=${player1}&player2=${player2}`;
    const r = await fetch(url);
    this.setState({games: await r.json()} as HeadToHeadPageState);
  }
  componentDidMount() {
    this.loadGames();
  }
  render() {
    const { root, addURL, player1, player2 } = this.props;
    const { games } = this.state;
    const numActivePlayers = 0;
    // getTotalActivePlayers(this.state.playersStats)
    return (
      <div className="playerPage">
        <NavigationBar
          root={root}
          addURL={addURL}
        />
        {games ?
          <Grid fluid={true}>
            <Panel header={'Head to Head'}>
              <Row>
                <Col md={8}>
                  <HeadToHeadStats games={games}/>
                  <WinGraph player1={player1} player2={player2} games={games}/>
                </Col>
                <Col md={4}>
                  <GoalDistribution player1={player1} player2={player2} games={games}/>
                  <RecentGames games={games.slice(games.length - 5).reverse()} showAllGames={true}/>
                </Col>
              </Row>
            </Panel>
          </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
}

ReactDOM.render(
  <HeadToHeadPage
    root={'http://www/~tlr/tntfl-test/'}
    addURL={'game/add'}
    player1={getParameterByName('player1')}
    player2={getParameterByName('player2')}
  />,
  document.getElementById('entry')
);
