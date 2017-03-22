import * as React from 'react';

import StatRow from './stat-row';

interface PointSwingRowProps {
  p1swing: number;
}
export default function PointSwingRow(props: PointSwingRowProps): JSX.Element {
  const { p1swing } = props;
  const v1formatted = p1swing > 0 ? p1swing.toFixed(3) : undefined
  const v2formatted = p1swing < 0 ? (-p1swing).toFixed(3) : undefined
  const redAhead = p1swing > 0
  const blueAhead = p1swing < 0;
  return (
    <StatRow name={'Point Swing'} redValue={v1formatted} blueValue={v2formatted} redAhead={redAhead} blueAhead={blueAhead}/>
  );
}
