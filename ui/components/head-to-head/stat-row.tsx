import * as React from 'react';

interface StatRowProps {
  name?: string;
  redValue?: string | number;
  blueValue?: string | number;
  redAhead?: boolean;
  blueAhead?: boolean;
}
export default function StatRow(props: StatRowProps): JSX.Element {
  const { name, redValue, blueValue, redAhead, blueAhead} = props;
  const redStyle = redAhead ? {backgroundColor: '#F00', color: 'white'} : undefined;
  const blueStyle = blueAhead ? {backgroundColor: '#00F', color: 'white'} : undefined;
  return (
    <tr>
      <td style={Object.assign({width: '30%'}, redStyle)}>{redValue}</td>
      <td style={{fontWeight: 'bold'}}>{name}</td>
      <td style={Object.assign({width: '30%'}, blueStyle)}>{blueValue}</td>
    </tr>
  );
}
