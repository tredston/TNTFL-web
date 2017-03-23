import * as React from 'react';

interface ItemProps {
  name: string;
  value: React.ReactNode;
}
export default function StatListItem(props: ItemProps): JSX.Element {
  const { name, value } = props;
  return (
    <div>
      <dt style={{whiteSpace: 'normal'}}>{name}</dt>
      <dd>{value}</dd>
    </div>
  )
}