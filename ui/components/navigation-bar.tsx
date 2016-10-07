import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

import AddGameForm from './add-game-form';

interface NavigationBarProps {
  header: string;
  addURL: string;
  onGameAdded: () => void;
}
export default function NavigationBar(props: NavigationBarProps): JSX.Element {
  const { header, addURL, onGameAdded } = props;
  return (
    <Navbar fluid={true}>
      <Navbar.Header>
        <Navbar.Brand>
          {'Table Football Ladder'}
        </Navbar.Brand>
      </Navbar.Header>
      <Nav bsStyle={'pills'}>
        <NavItem href="/~tlr/tntfl-ui/">Home</NavItem>
        <NavItem href="/~tlr/tntfl-ui/slice.html">Slice</NavItem>
        <NavItem href="/~tlr/tntfl-ui/belt.html">Belt</NavItem>
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
