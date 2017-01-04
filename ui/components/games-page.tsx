import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Panel } from 'react-bootstrap';

import GameList from './game-list';
import NavigationBar from './navigation-bar';
import Game from '../model/game';

interface GamesPageProps extends Props<GamesPage> {
  base: string;
  addURL: string;
  getUrl: string;
  title: string;
}
interface GamesPageState {
  games: Game[];
}
export default class GamesPage extends Component<GamesPageProps, GamesPageState> {
  constructor(props: GamesPageProps, context: any) {
    super(props, context);
    this.state = {
      games: [],
    }
  }
  async load() {
    const { base, getUrl } = this.props;
    const r = await fetch(getUrl);
    this.setState({games: await r.json()});
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { addURL, base, title } = this.props;
    const { games } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        {games
          ? <Grid fluid={true}>
              <Panel header={<h2>{title}</h2>}>
                <GameList games={games} base={base}/>
              </Panel>
            </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
}
