import * as React from 'react';
import { Button, Panel } from 'react-bootstrap';

import Ladder from './ladder';
import LadderEntry from '../model/ladder-entry';

interface Props {
  entries: LadderEntry[];
  atDate: number;
  showInactive: boolean;
  onShowInactive: () => void;
  bsStyle?: string;
}
export default function LadderPanel(props: Props): JSX.Element {
  const { entries, atDate, showInactive, onShowInactive, bsStyle } = props;
  return (
    <Panel bsStyle={bsStyle}>
      {entries
        ? <div>
            <Ladder entries={entries} atDate={atDate} showInactive={showInactive}/>
            <Button onClick={onShowInactive} style={{width: '100%'}}>
              {showInactive ? 'Hide inactive' : 'Show inactive'}
            </Button>
          </div>
        : 'Loading...'
      }
    </Panel>
  );
}
