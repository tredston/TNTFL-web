import * as React from 'react';
import { Component, Props } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { GamesApi } from 'tntfl-api';
import 'whatwg-fetch';

import AddGameForm from './add-game-form';

interface NavigationBarProps extends Props<NavigationBar> {
  base: string;
}
interface State {
  isBusy: boolean;
}
export default class NavigationBar extends Component<NavigationBarProps, State> {
  state = {
    isBusy: false,
  };

  render(): JSX.Element {
    const { base } = this.props;
    const { isBusy } = this.state;
    return (
      <Navbar fluid={true}>
        <Navbar.Header>
          <Navbar.Brand>
            {'Table Football Ladder'}
          </Navbar.Brand>
        </Navbar.Header>
        <Nav bsStyle={'pills'}>
          <NavItem href={base}>Home</NavItem>
          <NavItem href={base + 'stats/'}>Stats</NavItem>
          <NavItem href={base + 'speculate/'}>Speculate</NavItem>
          <NavItem href={base + 'api/'}>API</NavItem>
          <NavItem href={base + 'historic.cgi'}>Slice</NavItem>
        </Nav>
        <Nav pullRight>
          <AddGameForm
            base={base}
            isBusy={isBusy}
            onSubmit={(r, rs, b, bs) => this.onAddGame(r, rs, b, bs)}
          />
        </Nav>
      </Navbar>
    );
  }

  async onAddGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number) {
    const { base } = this.props;
    this.setState({isBusy: true});
    const r = await new GamesApi(fetch, base).addGameRedirect({redPlayer, redScore, bluePlayer, blueScore}) as Response;
    if (r.status === 200) {
      window.location.href = r.url;
    }
  }
}
