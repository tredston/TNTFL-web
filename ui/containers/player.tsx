import * as React from 'react';
import { Component, Props } from 'react';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Game, Achievement, Player } from 'tntfl-api';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import '../styles/style.less';

import PerPlayerStats from './per-player-stats';
import PlayerAchievements from '../components/player/player-achievements';
import PlayerSkillChart from '../components/player/player-skill-chart';
import PlayerStats from '../components/player/player-stats';
import RecentGames from '../components/recent-game-list';
import NavigationBar from '../components/navigation-bar';
import { getParameters, mostRecentGames } from '../utils/utils';
import { PlayersApi } from '../../swagger/tntfl-api/dist/api';

interface PlayerPageProps extends Props<PlayerPage> {
  base: string;
  playerName: string;
}
interface PlayerPageState {
  player?: Player;
  games?: Game[];
  achievements?: Achievement[];
  activePlayers?: number;
}
class PlayerPage extends Component<PlayerPageProps, PlayerPageState> {
  constructor(props: PlayerPageProps, context: any) {
    super(props, context);
    this.state = {
      player: undefined,
      games: undefined,
      achievements: undefined,
      activePlayers: undefined,
    };
  }
  async loadSummary() {
    const { base, playerName } = this.props;
    const player = await new PlayersApi(fetch, base).getPlayer({player: playerName});
    this.setState({player} as PlayerPageState);
  }
  async loadGames() {
    const { base, playerName } = this.props;
    const games = await new PlayersApi(fetch, base).getPlayerGames({player: playerName});
    this.setState({games} as PlayerPageState);
  }
  async loadAchievements() {
    const { base, playerName } = this.props;
    const achievements = await new PlayersApi(fetch, base).getPlayerAchievements({player: playerName});
    this.setState({achievements} as PlayerPageState);
  }
  async loadActivePlayers() {
    const { base } = this.props;
    const activePlayers = await new PlayersApi(fetch, base).getActive({});
    this.setState({activePlayers: activePlayers[Object.keys(activePlayers)[0]].count});
  }
  componentDidMount() {
    this.loadSummary();
    this.loadGames();
    this.loadAchievements();
    this.loadActivePlayers();
  }
  render() {
    const { playerName, base } = this.props;
    const { player, games, achievements, activePlayers } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
        />
        {player && games ?
          <Grid fluid={true}>
            <Row>
              <Col md={8}>
                <PlayerStats player={player} numActivePlayers={activePlayers || 0} games={games} base={base}/>
                <Panel>
                  <Panel.Heading><h2>Skill Chart</h2></Panel.Heading>
                  <Panel.Body>
                    <PlayerSkillChart playerName={player.name} games={games} />
                  </Panel.Body>
                </Panel>
                <PerPlayerStats playerName={playerName} base={base}/>
              </Col>
              <Col md={4}>
                <RecentGames games={mostRecentGames(games)} showAllGames={true} base={base}/>
                <Panel>
                  <Panel.Heading><h2>Achievements</h2></Panel.Heading>
                  <Panel.Body>
                    {achievements
                      ? <PlayerAchievements achievements={achievements} base={base}/>
                      : 'Loading...'
                    }
                  </Panel.Body>
                </Panel>
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
  <PlayerPage
    base={'../../'}
    playerName={getParameters(1)[0]}
  />,
  document.getElementById('entry'),
);
