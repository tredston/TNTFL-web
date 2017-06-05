import * as React from 'react';

interface PlayerNameProps {
  name: string;
  base: string;
  colour?: string;
}
export default function PlayerName(props: PlayerNameProps): JSX.Element {
  const { name, base, colour } = props;
  const colourClass = colour || '';
  return (
    <div className={`${colourClass}`} style={{fontSize: 'x-large', padding: 5}}>
      <a href={base + 'player/' + name}>
        {name}
      </a>
    </div>
  );
}
