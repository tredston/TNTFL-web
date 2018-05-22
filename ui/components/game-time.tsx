import * as React from 'react';

import { formatEpoch } from '../utils/utils';

interface GameTimeProps {
  date: number;
}
export default function GameTime(props: GameTimeProps): JSX.Element {
  const { date } = props;
  return (
    <span className='gameTime' style={{textAlign: 'center'}}>
      <a href={`/game/${date}`}>
        {formatEpoch(date)}
      </a>
    </span>
  );
}
