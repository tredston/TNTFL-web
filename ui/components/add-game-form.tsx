import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Navbar, Nav, NavItem, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import * as request from 'request';

import * as Palette from '../palette';

export interface AddGameFormProps extends Props<AddGameForm> {
    addURL: string;
    onGameAdded: () => void;
}
interface AddGameFormState {
  redPlayer: string;
  redScore: number;
  bluePlayer: string;
  blueScore: number;
}
export default class AddGameForm extends Component<AddGameFormProps, AddGameFormState> {
  constructor(props: AddGameFormProps, context: any) {
    super(props, context)
    this.state = {
      redPlayer: '',
      redScore: 0,
      bluePlayer: '',
      blueScore: 0,
    };
  }
  handleRedPlayerChange(e: string) {
    this.setState({redPlayer: e} as AddGameFormState);
  }
  handleRedScoreChange(e: number) {
    this.setState({redScore: e, blueScore: 10 - e} as AddGameFormState);
  }
  handleBluePlayerChange(e: string) {
    this.setState({bluePlayer: e} as AddGameFormState);
  }
  handleBlueScoreChange(e: number) {
    this.setState({blueScore: e} as AddGameFormState);
  }
  handleSubmit(e: any) {
    e.preventDefault();
    const { addURL, onGameAdded } = this.props;
    var game = {redPlayer: this.state.redPlayer, redScore: this.state.redScore, bluePlayer: this.state.bluePlayer, blueScore: this.state.blueScore}
    request.post({url: addURL, form: {what: 'derp'}}, (e, r, b) => onGameAdded());
    this.setState({redPlayer: '', redScore: 0, bluePlayer: '', blueScore: 0});
  }
  render() {
    const playerWidth = '6em';
    const scoreWidth = '3em';
    return (
      <Form inline style={{padding: 8}}>
        <FormGroup>
          <FormControl
            type="text"
            name="redPlayer"
            placeholder="Red"
            value={this.state.redPlayer}
            onChange={e => this.handleRedPlayerChange((e.target as any).value)}
            style={{backgroundColor: Palette.redFade, width: playerWidth, textAlign: 'center'}}
          /> <FormControl
            type="text"
            name="redScore"
            maxLength={2}
            placeholder="0"
            value={this.state.redScore}
            onChange={e => this.handleRedScoreChange((e.target as any).value)}
            style={{backgroundColor: Palette.redFade, width: scoreWidth, textAlign: 'center'}}
          /> - <FormControl
            type="text"
            name="blueScore"
            maxLength={2}
            placeholder="0"
            value={this.state.blueScore}
            onChange={e => this.handleBlueScoreChange((e.target as any).value)}
            style={{backgroundColor: Palette.blueFade, width: scoreWidth, textAlign: 'center'}}
          /> <FormControl
            type="text"
            name="bluePlayer"
            placeholder="Blue"
            value={this.state.bluePlayer}
            onChange={e => this.handleBluePlayerChange((e.target as any).value)}
            style={{backgroundColor: Palette.blueFade, width: playerWidth, textAlign: 'center'}}
          /> <Button type="submit" onClick={e => this.handleSubmit(e)}>
            Add game <span className="glyphicon glyphicon-triangle-right"/>
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
