import * as React from 'react';

interface PlayerNameProps {
  name: string;
  colour?: string;
}
export default function PlayerName(props: PlayerNameProps): JSX.Element {
  const { name, colour } = props;
  const colourClass = colour || '';
  return (
    <div className={`${colourClass}`} style={{fontSize: 'x-large', padding: 5}}>
      <a href={'/player/' + name}>
        {name}
      </a>
    </div>
  );
}
