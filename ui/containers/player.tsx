import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Achievement, Game, Player, PlayersApi } from 'tntfl-api';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import '../styles/achievement.less';
import '../styles/style.less';

import PerPlayerStats from './per-player-stats';
import PlayerAchievements from '../components/player/player-achievements';
import PlayerSkillChart from '../components/player/player-skill-chart';
import PlayerStats from '../components/player/player-stats';
import RecentGames from '../components/recent-game-list';
import NavigationBar from '../components/navigation-bar';
import { getParameters, mostRecentGames } from '../utils/utils';

interface PlayerPageProps extends Props<PlayerPage> {
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
    const { playerName } = this.props;
    const player = await new PlayersApi(undefined, '', fetch).getPlayer(playerName);
    this.setState({player} as PlayerPageState);
  }
  async loadGames() {
    const { playerName } = this.props;
    const games = await new PlayersApi(undefined, '', fetch).getPlayerGames(playerName);
    this.setState({games} as PlayerPageState);
  }
  async loadAchievements() {
    const { playerName } = this.props;
    const achievements = await new PlayersApi(undefined, '', fetch).getPlayerAchievements(playerName);
    this.setState({achievements} as PlayerPageState);
  }
  async loadActivePlayers() {
    const activePlayers = await new PlayersApi(undefined, '', fetch).getActive();
    this.setState({activePlayers: activePlayers[Object.keys(activePlayers)[0]].count});
  }
  componentDidMount() {
    this.loadSummary();
    this.loadGames();
    this.loadAchievements();
    this.loadActivePlayers();
  }
  render() {
    const { playerName } = this.props;
    const { player, games, achievements, activePlayers } = this.state;
    return (
      <div>
        <NavigationBar/>
        {player && games ?
          <div className={'ladder-page'}>
            <div className={'ladder-panel'}>
              <PlayerStats player={player} numActivePlayers={activePlayers || 0} games={games} />
              <Panel>
                <Panel.Heading><h2>Skill Chart</h2></Panel.Heading>
                <Panel.Body>
                  <PlayerSkillChart playerName={player.name} games={games} />
                </Panel.Body>
              </Panel>
              <PerPlayerStats playerName={playerName} />
            </div>
            <div className={'side-panel'}>
              <RecentGames games={mostRecentGames(games)} showAllGames={true} />
              <Panel>
                <Panel.Heading><h2>Achievements</h2></Panel.Heading>
                <Panel.Body>
                  {achievements
                    ? <PlayerAchievements achievements={achievements} />
                    : 'Loading...'
                  }
                </Panel.Body>
              </Panel>
            </div>
          </div>
          : 'Loading...'
        }
      </div>
    );
  }
}

ReactDOM.render(
  <PlayerPage
    playerName={getParameters(1)[0]}
  />,
  document.getElementById('entry'),
);
