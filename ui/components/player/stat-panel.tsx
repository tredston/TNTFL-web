import * as React from 'react';
import { CSSProperties } from 'react';
import { Panel } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

import GameTime from '../game-time';

const statStyle: CSSProperties = {
  fontSize: 'x-large',
  fontWeight: 'bold',
  textAlign: 'center',
};

interface StatBoxProps {
  title: string;
  style?: CSSProperties;
  classes?: string;
  children?: any;
}
export function StatBox(props: StatBoxProps): JSX.Element {
  const { title, children, style, classes } = props;
  const mergedStyle = Object.assign({}, statStyle, style);
  return (
    <Panel header={<h3>{title}</h3>} style={mergedStyle} className={classes}>
      {children}
    </Panel>
  );
}

interface InstantStatBoxProps {
  title: string;
  at?: number;
  children?: any;
  base: string;
}
export function InstantStatBox(props: InstantStatBoxProps): JSX.Element {
  const { title, at, children, base } = props;
  return (
    <Panel header={<h3>{title}</h3>} style={{textAlign: 'center'}}>
      <div style={statStyle}>{children}</div>
      <div style={{textAlign: 'right'}}>
        {at ? <span>at <GameTime date={at} base={base} /></span> : <span>before first game</span>}
      </div>
    </Panel>
  );
}

interface DurationStatBoxProps {
  title: string;
  from?: number;
  to?: number;
  children?: any;
  base: string;
  style?: CSSProperties;
}
export function DurationStatBox(props: DurationStatBoxProps): JSX.Element {
  const { title, from, to, children, base, style } = props;
  return (
    <Panel header={<h3>{title}</h3>} style={{...style, textAlign: 'center'}}>
      <div style={statStyle}>{children}</div>
      {from && <div style={{textAlign: 'right'}}>From <GameTime date={from} base={base} /></div>}
      {to && <div style={{textAlign: 'right'}}>to <GameTime date={to} base={base} /></div>}
    </Panel>
  );
}

interface PieStatBoxProps {
  title: string;
  style?: CSSProperties;
  data: any;
  children?: any;
}
export function PieStatBox(props: PieStatBoxProps): JSX.Element {
  const { title, style, data, children } = props;
  const mergedStyle = Object.assign({}, {textAlign: 'center'}, style);
  const options = {legend: {display: false}};
  return (
    <Panel header={<h3>{title}</h3>} style={mergedStyle}>
      <Pie data={data} options={options} />
      {children}
    </Panel>
  );
}
