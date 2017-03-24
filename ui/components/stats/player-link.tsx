import * as React from 'react';

interface PlayerLinkProps {
  base: string;
  name: string;
}
export default function PlayerLink(props: PlayerLinkProps): JSX.Element {
  const { base, name } = props;
  return (
    <a href={`${base}player/${name}`}>{name}</a>
  );
}
