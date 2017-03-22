import * as React from 'react';
import { Component, Props } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import 'whatwg-fetch';

import AddGameForm from './add-game-form';

interface NavigationBarProps extends Props<NavigationBar> {
  base: string;
  addURL: string;
}
interface State {
  isBusy: boolean;
}
export default class NavigationBar extends Component<NavigationBarProps, State> {
  constructor(props: NavigationBarProps, context: any) {
    super(props, context);
    this.state = {
      isBusy: false,
    }
  }
  render(): JSX.Element {
    const { base, addURL } = this.props;
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
            onSubmit={(redPlayer, redScore, bluePlayer, blueScore) => {
              this.setState({isBusy: true});
              const url = `${base}${addURL}?redPlayer=${redPlayer}&redScore=${+redScore}&bluePlayer=${bluePlayer}&blueScore=${+blueScore}`;
              const options: RequestInit = {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
              };
              fetch(url, options).then(r => {
                if (r.status == 200){
                  window.location.href = r.url;
                }
              });
            }}
          />
        </Nav>
      </Navbar>
    );
  }
}
