import * as React from 'react';
import { Component, Props } from 'react';
import { Button, Panel } from 'react-bootstrap';
import { LadderEntry } from 'tntfl-api';

import Ladder from './ladder';

interface LadderPanelProps extends Props<LadderPanel> {
  entries?: LadderEntry[];
  atDate: number;
  bsStyle?: string;
}
interface State {
  showInactive: boolean;
}
export default class LadderPanel extends Component<LadderPanelProps, State> {
  state = {
    showInactive: false,
  };

  onShowInactive() {
    const { showInactive } = this.state;
    this.setState({showInactive: !showInactive});
  }
  render(): JSX.Element {
    const { entries, atDate, bsStyle } = this.props;
    const { showInactive } = this.state;
    return (
      <Panel bsStyle={bsStyle}>
        {entries
          ? <div>
              <Ladder entries={entries} atDate={atDate} showInactive={showInactive}/>
              <Button onClick={() => this.onShowInactive()} style={{width: '100%'}}>
                {showInactive ? 'Hide inactive' : 'Show inactive'}
              </Button>
            </div>
          : 'Loading...'
        }
      </Panel>
    );
  }
}
