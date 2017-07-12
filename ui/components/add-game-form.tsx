import * as React from 'react';
import { Component, Props, CSSProperties, FormEvent } from 'react';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';

import * as Palette from '../palette';

interface ScoreProps {
  name: string;
  value: string;
  onChange: (e: FormEvent<any>) => void;
  style: CSSProperties;
}
function Score(props: ScoreProps): JSX.Element {
  const { name, value, onChange, style } = props;
  const scoreWidth = '3em';
  return (
    <FormControl
      type='text'
      maxLength={2}
      placeholder='0'
      name={name}
      value={value}
      onChange={e => onChange(e)}
      style={Object.assign({width: scoreWidth, textAlign: 'center'}, style)}
    />
  );
}

export interface AddGameFormProps extends Props<AddGameForm> {
  base: string;
  isBusy: boolean;
  onSubmit: (redPlayer: string, redScore: number, bluePlayer: string, blueScore: number) => void;
}
interface AddGameFormState {
  redPlayer: string;
  redScore: string;
  bluePlayer: string;
  blueScore: string;
}
export default class AddGameForm extends Component<AddGameFormProps, AddGameFormState> {
  state = {
    redPlayer: '',
    redScore: '',
    bluePlayer: '',
    blueScore: '',
  };

  handleRedPlayerChange(e: string) {
    this.setState({redPlayer: e} as AddGameFormState);
  }
  handleRedScoreChange(e: string) {
    this.setState({redScore: e, blueScore: '' + (10 - +e)} as AddGameFormState);
  }
  handleBluePlayerChange(e: string) {
    this.setState({bluePlayer: e} as AddGameFormState);
  }
  handleBlueScoreChange(e: string) {
    this.setState({blueScore: e} as AddGameFormState);
  }
  handleSubmit(e: any) {
    e.preventDefault();
    const { onSubmit } = this.props;
    const { redPlayer, redScore, bluePlayer, blueScore } = this.state;
    onSubmit(redPlayer, +redScore, bluePlayer, +blueScore);
  }
  isValid(): boolean {
    const { redPlayer, redScore, bluePlayer, blueScore } = this.state;
    const scoreValid = (score: number): boolean => {
      return !isNaN(score) && score >= 0;
    };
    return redPlayer.length > 0 && redScore.length > 0 &&
      bluePlayer.length > 0 && blueScore.length > 0 &&
      scoreValid(+redScore) && scoreValid(+blueScore);
  }
  render() {
    const { base, isBusy } = this.props;
    const playerWidth = '6em';
    return (
      <Form inline style={{padding: 8}}>
        <FormGroup>
          <FormControl
            type='text'
            name='redPlayer'
            placeholder='Red'
            value={this.state.redPlayer}
            onChange={e => this.handleRedPlayerChange((e.target as any).value)}
            style={{backgroundColor: Palette.redFade, width: playerWidth, textAlign: 'center'}}
          /> <Score
            name={'redScore'}
            value={this.state.redScore}
            onChange={e => this.handleRedScoreChange((e.target as any).value)}
            style={{backgroundColor: Palette.redFade}}
          /> - <Score
            name={'blueScore'}
            value={this.state.blueScore}
            onChange={e => this.handleBlueScoreChange((e.target as any).value)}
            style={{backgroundColor: Palette.blueFade}}
          /> <FormControl
            type='text'
            name='bluePlayer'
            placeholder='Blue'
            value={this.state.bluePlayer}
            onChange={e => this.handleBluePlayerChange((e.target as any).value)}
            style={{backgroundColor: Palette.blueFade, width: playerWidth, textAlign: 'center'}}
          /> <Button type='submit' onClick={e => this.handleSubmit(e)} disabled={!this.isValid() && !isBusy}>
            {!isBusy && <span>Add game <span className='glyphicon glyphicon-triangle-right'/></span>}
            {isBusy && <span><img src={`${base}img/spinner.gif`}/></span>}
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
