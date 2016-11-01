import * as React from 'react';

import PlayerNameLink from './player-name-link';

interface PlayerNameProps {
  name: string;
  base: string;
  colour?: string;
  yellow?: boolean;
}
export default function PlayerName(props: PlayerNameProps): JSX.Element {
  const { name, base, colour, yellow } = props;
  const colourClass = colour || '';
  return (
    <div className={`${colourClass} ${yellow ? 'yellow-stripe' : ''}`} style={{fontSize: 'x-large'}}>
      <a href={base + "player/" + name}>
        {name}
      </a>
    </div>
  );
}
