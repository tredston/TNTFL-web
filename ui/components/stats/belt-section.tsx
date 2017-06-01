import * as React from 'react';
import { Panel } from 'react-bootstrap';
import * as Pluralize from 'pluralize';

import PlayerLink from './player-link';
import { Belt, BeltStat } from '../../model/stats';
import StatListItem from './stat-list-item';

interface BeltSectionStatProps {
  stat: BeltStat;
  base: string;
}
function BeltSectionStat(props: BeltSectionStatProps): JSX.Element {
  const { stat, base } = props;
  return (
    <span>
      <b><PlayerLink name={stat.player} base={base} /></b> ({Pluralize('games', stat.count, true)})
    </span>
  );
}

interface BeltSectionProps {
  belt: Belt;
  base: string;
}
export default function BeltSection(props: BeltSectionProps): JSX.Element {
  const { belt, base } = props;
  const { current, best } = belt;
  return (
    <Panel header={'Belt'}>
      <dl className='dl-horizontal'>
        <StatListItem
          name={'Current holder'}
          value={<BeltSectionStat stat={current} base={base} />}
        />
        <StatListItem
          name={'Longest holder'}
          value={<BeltSectionStat stat={best} base={base} />}
        />
      </dl>
    </Panel>
  );
}
