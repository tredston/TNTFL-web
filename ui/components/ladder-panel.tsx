import * as React from 'react';
import { Button, Panel } from 'react-bootstrap';

import Ladder from './ladder';
import LadderEntry from '../model/ladder-entry';

interface Props {
  entries: LadderEntry[];
  atDate: number;
  showInactive: boolean;
  onShowInactive: () => void;
}
export default function LadderPanel(props: Props): JSX.Element {
  const { entries, atDate, showInactive, onShowInactive } = props;
  return (
    <Panel>
      {entries
        ? <div>
            <Ladder entries={entries} atDate={atDate}/>
            <Button onClick={onShowInactive} style={{width: '100%'}}>
              {showInactive ? 'Hide inactive' : 'Show inactive'}
            </Button>
          </div>
        : 'Loading...'
      }
    </Panel>
  );
}
