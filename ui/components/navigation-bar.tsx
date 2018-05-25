import * as React from 'react';
import { Component, Props } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { GamesApi } from 'tntfl-api';

import AddGameForm from './add-game-form';

interface NavigationBarProps extends Props<NavigationBar> {
}
interface State {
  isBusy: boolean;
}
export default class NavigationBar extends Component<NavigationBarProps, State> {
  state = {
    isBusy: false,
  };

  render(): JSX.Element {
    const { isBusy } = this.state;
    return (
      <Navbar fluid={true}>
        <Navbar.Header>
          <Navbar.Brand>
            {'Table Football Ladder'}
          </Navbar.Brand>
        </Navbar.Header>
        <Nav bsStyle={'pills'}>
          <NavItem href={'/'}>Home</NavItem>
          <NavItem href={'/stats/'}>Stats</NavItem>
          <NavItem href={'/speculate/'}>Speculate</NavItem>
          <NavItem href={'/api/'}>API</NavItem>
          <NavItem href={'/historic/'}>Slice</NavItem>
        </Nav>
        <Nav pullRight>
          <AddGameForm
            isBusy={isBusy}
            onSubmit={(r, rs, b, bs) => this.onAddGame(r, rs, b, bs)}
          />
        </Nav>
      </Navbar>
    );
  }

  async onAddGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number) {
    this.setState({isBusy: true});
    const newGame = await new GamesApi(undefined, '', fetch).addGame(redPlayer, redScore, bluePlayer, blueScore);
    window.location.href = `/game/${newGame.date}`;
  }
}
