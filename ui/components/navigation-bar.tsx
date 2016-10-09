import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import AddGameForm from './add-game-form';

interface NavigationBarProps {
  root: string;
  addURL: string;
  onGameAdded: () => void;
}
export default function NavigationBar(props: NavigationBarProps): JSX.Element {
  const { root, addURL, onGameAdded } = props;
  return (
    <Navbar fluid={true}>
      <Navbar.Header>
        <Navbar.Brand>
          {'Table Football Ladder'}
        </Navbar.Brand>
      </Navbar.Header>
      <Nav bsStyle={'pills'}>
        <NavItem href={root}>Home</NavItem>
        <NavItem href={root + 'stats/'}>Stats</NavItem>
        <NavItem href={root + 'speculate/'}>Speculate</NavItem>
        <NavItem href={root + 'api/'}>API</NavItem>
        <NavItem href={root + 'historic.cgi'}>Slice</NavItem>
      </Nav>
      <Nav pullRight>
        <AddGameForm
          addURL={addURL}
          onGameAdded={onGameAdded}
        />
      </Nav>
    </Navbar>
  );
}
