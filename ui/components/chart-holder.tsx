import * as React from 'react';
import { Props } from 'react';

interface ChartHolderProps extends Props<any> {

}
export default function ChartHolder(props: ChartHolderProps): JSX.Element {
  const { children } = props;
  return (
    <div style={{width: 100, height: 50}}>
      {children}
    </div>
  );
}
