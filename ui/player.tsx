import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';

import RecentGames from './components/recent-game-list';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';
import Player from './model/player';
import { getParameterByName, getLadderLeagueClass, formatEpoch } from './utils/utils';

interface StatBoxProps {
  title: string;
  caption?: string;
  classes?: string;
  style?: CSSProperties;
  children?: any;
}
function StatBox(props: StatBoxProps): JSX.Element {
  const { title, caption, children, classes, style } = props;
  return (
    <Panel header={<h3>{title}</h3>}>
      {children}
    </Panel>
  );
}

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  numActivePlayers: number;
}
function PlayerStats(props: PlayerStatsProps): JSX.Element {
  function sideStyle(player: Player): CSSProperties {
    var redness = (player.total.gamesAsRed / player.total.games);
    return {backgroundColor: 'rgb(' + Math.round(redness * 255) + ', 0, '  + Math.round((1 - redness) * 255) + ')'};
  };
  function sidePreference(player: Player): string {
    var redness = (player.total.gamesAsRed / player.total.games) * 100;
    return (redness >= 50) ? (redness.toFixed(2) + "% red") : ((100-redness).toFixed(2) + "% blue")
  };
  function getSkillChange(playerName: string, games: Game[]): number {
    var skill = 0;
    for (var i = 0; i < games.length; i++)
      skill += games[i].red.name == playerName ? games[i].red.skillChange : games[i].blue.skillChange;
    return skill;
  };
  function getRankChange(playerName: string, games: Game[]): number {
    var change = 0;
    if (games.length > 0) {
      var endRank = games[games.length - 1].red.name == playerName ? games[games.length - 1].red.newRank : games[games.length - 1].blue.newRank
      var startRank = games[0].red.name == playerName ? games[0].red.newRank - games[0].red.rankChange : games[0].blue.newRank - games[0].blue.rankChange;
      change = startRank - endRank;
    }
    return change;
  };
  const { player, numActivePlayers, games } = props;
  const gamesToday = games.slice(games.length - player.total.gamesToday);
  const goalRatio = player.total.for / player.total.against;
  const skillChangeToday = getSkillChange(player.name, gamesToday);
  const rankChangeToday = getRankChange(player.name, gamesToday);
  return (
    <Panel header={<h1>{player.name}</h1>}>
      <Row>
        <Col sm={3}><StatBox title="Current Ranking" classes={"ladder-position " + getLadderLeagueClass(player.rank, numActivePlayers)}>
          {player.rank !== -1 ? player.rank : '-'}
        </StatBox></Col>
        <Col sm={3}><StatBox title="Skill">{player.skill.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title="Side preference" classes="side-preference" style={sideStyle(player)}>{sidePreference(player)}</StatBox></Col>
        <Col sm={3}/>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Total games">{player.total.games}</StatBox></Col>
        <Col sm={3}><StatBox title="Wins">{player.total.wins}</StatBox></Col>
        <Col sm={3}><StatBox title="Losses">{player.total.losses}</StatBox></Col>
        <Col sm={3}><StatBox title="Draws">{(player.total.games - player.total.wins - player.total.losses)}</StatBox></Col>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Goals for">{player.total.for}</StatBox></Col>
        <Col sm={3}><StatBox title="Goals against">{player.total.against}</StatBox></Col>
        <Col sm={3}><StatBox title="Goal ratio" classes={goalRatio > 1 ? "positive" : "negative"}>{goalRatio.toFixed(3)}</StatBox></Col>
        <Col sm={3}/>
      </Row>
      <Row>
        <Col sm={3}><StatBox title="Games today">{gamesToday.length}</StatBox></Col>
        <Col sm={3}><StatBox title="Skill change today" classes={skillChangeToday >= 0 ? "positive" : "negative"}>{skillChangeToday.toFixed(3)}</StatBox></Col>
        <Col sm={3}><StatBox title="Rank change today" classes={rankChangeToday >= 0 ? "positive" : "negative"}>{rankChangeToday}</StatBox></Col>
        <Col sm={3}/>
        {/*TODO <StatBox title="Current streak">{get_template("durationStat.mako", value="{0} {1}".format(currentStreak.count, currentStreakType), fromDate=currentStreak.fromDate, toDate=currentStreak.toDate, base=self.attr.base))</StatBox>*/}
      </Row>
      <Row>
        {/*TODO <StatBox title="Highest ever skill">{get_template("pointInTimeStat.mako", skill=skillBounds['highest']['skill'], time=skillBounds['highest']['time'], base=self.attr.base))</StatBox>*/}
        {/*TODO <StatBox title="Lowest ever skill">{get_template("pointInTimeStat.mako", skill=skillBounds['lowest']['skill'], time=skillBounds['lowest']['time'], base=self.attr.base))</StatBox>*/}
        {/*TODO <StatBox title="Longest winning streak">{get_template("durationStat.mako", value=winStreak.count, fromDate=winStreak.fromDate, toDate=winStreak.toDate, base=self.attr.base))</StatBox>*/}
        {/*TODO <StatBox title="Longest losing streak">{get_template("durationStat.mako", value=loseStreak.count, fromDate=loseStreak.fromDate, toDate=loseStreak.toDate, base=self.attr.base))</StatBox>*/}
      </Row>
    </Panel>
  );
}

interface SkillChartProps {
  playerName: string;
  games: Game[];
}
function SkillChart(props: SkillChartProps): JSX.Element {
  const { playerName, games } = props;
  let skill = 0;
  const skillLine = games.map((game) => {
    skill += game.red.name == playerName ? game.red.skillChange : game.blue.skillChange;
    return {x: game.date * 1000, y: skill};
  });
  const data = {datasets: [{
    data: skillLine,
    fill: false,
    borderColor: '#0000FF',
  }]};
  const options = {
    scales: {xAxes: [{type: 'time'}]},
    legend: {display: false},
    tooltips: {callbacks: {
      title: (tooltip: any, point: any) => formatEpoch(tooltip[0].xLabel / 1000),
      label: (tooltip: any, point: any) => tooltip.yLabel.toFixed(3),
    }}
  };
  return (
    <Panel header={'Skill Chart'}>
      <Line data={data} options={options}/>
    </Panel>
  );
}

interface PlayerPageProps extends Props<PlayerPage> {
  root: string;
  addURL: string;
  playerName: string;
}
interface PlayerPageState {
  player: Player;
  games: Game[];
}
class PlayerPage extends Component<PlayerPageProps, PlayerPageState> {
  constructor(props: PlayerPageProps, context: any) {
      super(props, context);
      this.state = {
        player: undefined,
        games: [],
      };
  }
  async loadSummary() {
    const { root, playerName } = this.props;
    const url = `${root}player.cgi?method=view&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({player: await r.json()} as PlayerPageState);
  }
  async loadGames() {
    const { root, playerName } = this.props;
    const url = `${root}player.cgi?method=games&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({games: await r.json()} as PlayerPageState);
  }
  componentDidMount() {
    this.loadSummary();
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
        {this.state.player ?
          <Grid fluid={true}>
            <Row>
              <Col md={8}>
                <PlayerStats player={this.state.player} numActivePlayers={numActivePlayers} games={this.state.games}/>
                <SkillChart playerName={this.state.player.name} games={this.state.games} />
                {/*TODO <PerPlayerStats />*/}
              </Col>
              <Col md={4}>
                <RecentGames games={this.state.games.slice(this.state.games.length - 5).reverse()} showAllGames={true}/>
                {/*TODO <Most significant />*/}
                {/*TODO <First game />*/}
                {/*TODO <achievements />*/}
              </Col>
            </Row>
          </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
};

ReactDOM.render(
  <PlayerPage
    root={'http://www/~tlr/tntfl-test/'}
    addURL={'game/add'}
    playerName={getParameterByName('player')}
  />,
  document.getElementById('entry')
);
