import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Panel } from 'react-bootstrap';
import { Game } from 'tntfl-api';

import GameList from '../components/game-list';
import NavigationBar from '../components/navigation-bar';

interface GamesPageProps extends Props<GamesPage> {
  base: string;
  getUrl: string;
  title: string;
}
interface GamesPageState {
  games?: Game[];
}
export default class GamesPage extends Component<GamesPageProps, GamesPageState> {
  constructor(props: GamesPageProps, context: any) {
    super(props, context);
    this.state = {
      games: undefined,
    };
  }
  async load() {
    const { getUrl } = this.props;
    const r = await fetch(getUrl);
    this.setState({games: await r.json()});
  }
  componentDidMount() {
    this.load();
  }
  render() {
    const { base, title } = this.props;
    const { games } = this.state;
    return (
      <div>
        <NavigationBar
          base={base}
        />
        {games
          ? <Grid fluid={true}>
              <Panel>
                <Panel.Heading><h2>{title}</h2></Panel.Heading>
                <Panel.Body>
                  <GameList games={games.slice().reverse()} base={base}/>
                </Panel.Body>
              </Panel>
            </Grid>
          : 'Loading...'
        }
      </div>
    );
  }
}
