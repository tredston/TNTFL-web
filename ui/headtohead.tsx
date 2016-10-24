import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';

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
  player1: Player;
  player2: Player;
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
  games: Game[];
}
function GoalDistribution(props: GoalDistributionProps): JSX.Element {
  return (
    <div/>
  );
}

interface HeadToHeadPageProps extends Props<HeadToHeadPage> {
  root: string;
  addURL: string;
  player1: string;
  player2: string;
}
interface HeadToHeadPageState {
  player1: Player;
  player2: Player;
  games: Game[];
}
class HeadToHeadPage extends Component<HeadToHeadPageProps, HeadToHeadPageState> {
  constructor(props: HeadToHeadPageProps, context: any) {
      super(props, context);
      this.state = {
        player1: undefined,
        player2: undefined,
        games: [],
      };
  }
  async loadPlayer(player: string): Promise<any> {
    const { root } = this.props;
    const url = `${root}player.cgi?method=view&view=json&player=${player}`;
    const r = await fetch(url);
    return await r.json();
  }
  async loadPlayers() {
    const { player1, player2 } = this.props;
    const p1 = this.loadPlayer(player1);
    const p2 = this.loadPlayer(player2);
    this.setState({player1: await p1, player2: await p2} as HeadToHeadPageState);
  }
  async loadGames() {
    const { root, player1, player2 } = this.props;
    const url = `${root}headtohead.cgi?method=games&view=json&player1=${player1}&player2=${player2}`;
    const r = await fetch(url);
    this.setState({games: await r.json()} as HeadToHeadPageState);
  }
  componentDidMount() {
    this.loadPlayers();
    this.loadGames();
  }
  render() {
    const { root, addURL } = this.props;
    const numActivePlayers = 0;
    // getTotalActivePlayers(this.state.playersStats)
    return (
      <div className="playerPage">
        <NavigationBar
          root={root}
          addURL={addURL}
        />
        {this.state.player1 && this.state.player2 ?
          <Grid fluid={true}>
            <Panel header={'Head to Head'}>
              <Row>
                <Col md={4}>
                  <WinGraph player1={this.props.player1} player2={this.props.player2} games={this.state.games}/>
                  <RecentGames games={this.state.games} showAllGames={true}/>
                </Col>
                <Col md={4}>
                  <HeadToHeadStats player1={this.state.player1} player2={this.state.player2} games={this.state.games}/>
                </Col>
                <Col md={4}>
                  <GoalDistribution games={this.state.games}/>
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
