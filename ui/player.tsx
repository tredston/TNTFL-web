import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import PerPlayerStats from './components/per-player-stats';
import PlayerAchievements from './components/player-achievements';
import PlayerSkillChart from './components/player-skill-chart';
import PlayerStats from './components/player-stats';
import RecentGames from './components/recent-game-list';
import NavigationBar from './components/navigation-bar';
import Achievement from './model/achievement';
import Game from './model/game';
import PerPlayerStat from './model/per-player-stat';
import Player from './model/player';
import { getParameters } from './utils/utils';

interface PlayerPageProps extends Props<PlayerPage> {
  base: string;
  addURL: string;
  playerName: string;
}
interface PlayerPageState {
  player: Player;
  games: Game[];
  perPlayerStats: PerPlayerStat[];
  achievements: Achievement[];
  activePlayers: number;
}
class PlayerPage extends Component<PlayerPageProps, PlayerPageState> {
  constructor(props: PlayerPageProps, context: any) {
    super(props, context);
    this.state = {
      player: undefined,
      games: undefined,
      perPlayerStats: undefined,
      achievements: undefined,
      activePlayers: undefined,
    };
  }
  async loadSummary() {
    const { base, playerName } = this.props;
    const url = `${base}player.cgi?method=view&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({player: await r.json()} as PlayerPageState);
  }
  async loadGames() {
    const { base, playerName } = this.props;
    const url = `${base}player.cgi?method=games&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({games: await r.json()} as PlayerPageState);
  }
  async loadPerPlayerStats() {
    const { base, playerName } = this.props;
    const url = `${base}player.cgi?method=perplayerstats&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({perPlayerStats: await r.json()} as PlayerPageState);
  }
  async loadAchievements() {
    const { base, playerName } = this.props;
    const url = `${base}player.cgi?method=achievements&view=json&player=${playerName}`;
    const r = await fetch(url);
    this.setState({achievements: await r.json()} as PlayerPageState);
  }
  async loadActivePlayers() {
    const { base } = this.props;
    const url = `${base}activePlayers.cgi`;
    const r = await fetch(url);
    this.setState({activePlayers: await r.json()} as PlayerPageState);
  }
  componentDidMount() {
    this.loadSummary();
    this.loadGames();
    this.loadPerPlayerStats();
    this.loadAchievements();
    this.loadActivePlayers();
  }
  render() {
    const { playerName, base, addURL } = this.props;
    const { player, games, perPlayerStats, achievements, activePlayers } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        {player && games ?
          <Grid fluid={true}>
            <Row>
              <Col md={8}>
                <PlayerStats player={player} numActivePlayers={activePlayers} games={games}/>
                <Panel header={<h2>Skill Chart</h2>}>
                  <PlayerSkillChart playerName={player.name} games={games} />
                </Panel>
                <PerPlayerStats playerName={playerName} stats={perPlayerStats} base={base}/>
              </Col>
              <Col md={4}>
                <RecentGames games={games.slice(games.length - 5).reverse()} showAllGames={true} base={base}/>
                {/*TODO <Most significant />*/}
                {/*TODO <First game />*/}
                <PlayerAchievements achievements={achievements}/>
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
    base={'../../'}
    addURL={'game/add'}
    playerName={getParameters(1)[0]}
  />,
  document.getElementById('entry')
);
