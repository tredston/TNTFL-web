import * as React from 'react';

interface PlayerLinkProps {
  name: string;
}
export default function PlayerLink(props: PlayerLinkProps): JSX.Element {
  const { name } = props;
  return (
    <a href={`/player/${name}`}>{name}</a>
  );
}
