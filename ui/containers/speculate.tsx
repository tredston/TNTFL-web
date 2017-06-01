import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import GameList from '../components/game-list';
import NavigationBar from '../components/navigation-bar';
import AddGameForm from '../components/add-game-form';
import LadderPanel from '../components/ladder-panel';
import Game from '../model/game';
import LadderEntry from '../model/ladder-entry';

interface SpeculatePageProps extends Props<SpeculatePage> {
  base: string;
  addURL: string;
}
interface SpeculatePageState {
  speculated?: {
    entries: LadderEntry[],
    games: Game[],
  },
  isBusy: boolean;
}
export default class SpeculatePage extends Component<SpeculatePageProps, SpeculatePageState> {
  constructor(props: SpeculatePageProps, context: any) {
    super(props, context);
    this.state = {
      speculated: undefined,
      isBusy: false,
    }
  }
  async loadLadder(games: Game[]) {
    const { base } = this.props;
    const serialised = games.map(g => `${g.red.name},${g.red.score},${g.blue.score},${g.blue.name}`).join(',');
    let url = `${base}speculate.cgi?view=json&players=1&previousGames=${serialised}&showInactive=1`;
    const r = await fetch(url);
    this.setState({speculated: await r.json()} as SpeculatePageState);
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
    const { addURL, base } = this.props;
    const { speculated, isBusy } = this.state;
    const isSpeculating = speculated && speculated.games.length > 0;
    const now = (new Date()).getTime() / 1000;
    const entries = speculated && speculated.entries;
    return (
      <div>
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        <Grid fluid={true}>
          <Row>
            <Col lg={8}>
              <LadderPanel
                entries={entries}
                atDate={now}
                bsStyle={isSpeculating ? 'warning' : undefined}
              />
            </Col>
            <Col lg={4}>
              <Panel header={'Speculative Games'}>
                <AddGameForm
                  base={base}
                  isBusy={isBusy}
                  onSubmit={(rp, rs, bp, bs) => this.onAddGame(rp, rs, bp, bs)}
                />
                {speculated && <GameList games={speculated.games.slice().reverse()} base={base}/>}
                <a href='#' onClick={(e) => this.onReset(e)}>Reset speculation</a>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(
  <SpeculatePage
    base={'../'}
    addURL={'game/add'}
  />,
  document.getElementById('entry')
);
