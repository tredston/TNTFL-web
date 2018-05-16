import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import { Game, LadderApi, Speculated } from 'tntfl-api';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import '../styles/style.less';

import GameList from '../components/game-list';
import NavigationBar from '../components/navigation-bar';
import AddGameForm from '../components/add-game-form';
import LadderPanel from '../components/ladder-panel';

interface SpeculatePageProps extends Props<SpeculatePage> {
  base: string;
}
interface SpeculatePageState {
  speculated?: Speculated;
  isBusy: boolean;
}
export default class SpeculatePage extends Component<SpeculatePageProps, SpeculatePageState> {
  constructor(props: SpeculatePageProps, context: any) {
    super(props, context);
    this.state = {
      speculated: undefined,
      isBusy: false,
    };
  }
  async loadLadder(games: Game[]) {
    const { base } = this.props;
    const serialised = games.map(g => `${g.red.name},${g.red.score},${g.blue.score},${g.blue.name}`).join(',');
    const api = new LadderApi(fetch, base);
    const speculated = await api.speculate({showInactive: 1, players: 1, previousGames: serialised});
    this.setState({speculated} as SpeculatePageState);
  }
  componentDidMount() {
    const { speculated } = this.state;
    this.loadLadder((speculated && speculated.games) || []);
  }
  onAddGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number) {
    this.setState({isBusy: true} as SpeculatePageState);
    const { speculated } = this.state;
    if (speculated) {
      const games = speculated.games.slice();
      games.push({
        red: {
          name: redPlayer,
          score: redScore,
          rankChange: undefined,
          newRank: undefined,
          skillChange: undefined,
          achievements: [],
        },
        blue: {
          name: bluePlayer,
          score: blueScore,
          rankChange: undefined,
          newRank: undefined,
          skillChange: undefined,
          achievements: [],
        },
        date: undefined,
      } as any);
      this.loadLadder(games).then(() => this.setState({isBusy: false} as SpeculatePageState));
    }
  }
  onReset(e: any) {
    e.preventDefault();
    this.setState({isBusy: true} as SpeculatePageState);
    this.loadLadder([]).then(() => this.setState({isBusy: false} as SpeculatePageState));
  }
  render() {
    const { base } = this.props;
    const { speculated, isBusy } = this.state;
    const isSpeculating = speculated && speculated.games.length > 0;
    const entries = speculated && speculated.entries;
    return (
      <div>
        <NavigationBar
          base={base}
        />
        <div className={'ladder-page'}>
          <div className={'ladder-panel'}>
            <LadderPanel
              entries={entries}
              speculative={isSpeculating}
              base={base}
            />
          </div>
          <div className={'side-panel'}>
            <Panel>
              <Panel.Heading>Speculative Games</Panel.Heading>
              <Panel.Body>
                <AddGameForm
                  isBusy={isBusy}
                  onSubmit={(rp, rs, bp, bs) => this.onAddGame(rp, rs, bp, bs)}
                />
                {speculated && <GameList games={speculated.games.slice().reverse()} base={base}/>}
                <a href='#' onClick={(e) => this.onReset(e)}>Reset speculation</a>
              </Panel.Body>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <SpeculatePage
    base={__tntfl_base_path__}
  />,
  document.getElementById('entry'),
);
