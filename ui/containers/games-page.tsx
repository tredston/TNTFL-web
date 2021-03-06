import * as React from 'react';
import { Component, Props } from 'react';
import { Panel } from 'react-bootstrap';
import { Game } from 'tntfl-api';

import GameList from '../components/game-list';
import NavigationBar from '../components/navigation-bar';

interface GamesPageProps extends Props<GamesPage> {
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
    const { title } = this.props;
    const { games } = this.state;
    return (
      <div>
        <NavigationBar/>
        {games
          ? <div className={'page-container'}>
              <Panel>
                <Panel.Heading><h2>{title}</h2></Panel.Heading>
                <Panel.Body>
                  <GameList games={games.slice().reverse()} />
                </Panel.Body>
              </Panel>
            </div>
          : 'Loading...'
        }
      </div>
    );
  }
}
