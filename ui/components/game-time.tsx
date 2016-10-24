import * as React from 'react';
import * as classNames from 'classnames';

import { formatEpoch } from '../utils/utils';

interface GameTimeProps {
  date: number;
  base: string;
}
export default function GameTime(props: GameTimeProps): JSX.Element {
  const { date, base } = props;
  return (
    <div className="gameTime" style={{textAlign: 'center'}}>
      <a href={base + "game/" + date}>
        {formatEpoch(date)}
      </a>
    </div>
  );
}
