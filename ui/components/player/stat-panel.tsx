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
  bodyStyle?: CSSProperties;
  classes?: string;
  children?: any;
}
export function StatBox(props: StatBoxProps): JSX.Element {
  const { title, children, style, bodyStyle, classes } = props;
  return (
    <Panel className={classes}>
      <Panel.Heading style={style}><h3>{title}</h3></Panel.Heading>
      <Panel.Body style={{...statStyle, ...bodyStyle}}>{children}</Panel.Body>
    </Panel>
  );
}

interface InstantStatBoxProps {
  title: string;
  at?: number;
  children?: any;
}
export function InstantStatBox(props: InstantStatBoxProps): JSX.Element {
  const { title, at, children } = props;
  return (
    <Panel>
      <Panel.Heading style={{textAlign: 'center'}}><h3>{title}</h3></Panel.Heading>
      <Panel.Body>
        <div style={statStyle}>{children}</div>
        <div style={{textAlign: 'right'}}>
          {at ? <span>at <GameTime date={at} /></span> : <span>before first game</span>}
        </div>
      </Panel.Body>
    </Panel>
  );
}

interface DurationStatBoxProps {
  title: string;
  from?: number;
  to?: number;
  children?: any;
  style?: CSSProperties;
}
export function DurationStatBox(props: DurationStatBoxProps): JSX.Element {
  const { title, from, to, children, style } = props;
  return (
    <Panel>
      <Panel.Heading style={{...style, textAlign: 'center'}}><h3>{title}</h3></Panel.Heading>
      <Panel.Body>
        <div style={statStyle}>{children}</div>
        {from && <div style={{textAlign: 'right'}}>From <GameTime date={from} /></div>}
        {to && <div style={{textAlign: 'right'}}>to <GameTime date={to} /></div>}
      </Panel.Body>
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
    <Panel>
      <Panel.Heading style={mergedStyle}><h3>{title}</h3></Panel.Heading>
      <Panel.Body>
        <Pie data={data} options={options} height={100} width={120} />
        {children}
      </Panel.Body>
    </Panel>
  );
}
