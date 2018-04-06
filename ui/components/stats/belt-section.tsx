import * as React from 'react';
import { Panel } from 'react-bootstrap';
import * as Pluralize from 'pluralize';
import { Belt, Streak } from 'tntfl-api';

import PlayerLink from './player-link';
import StatListItem from './stat-list-item';

interface BeltSectionStatProps {
  stat: Streak;
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
    <Panel>
      <Panel.Heading>Belt</Panel.Heading>
      <Panel.Body>
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
      </Panel.Body>
    </Panel>
  );
}
