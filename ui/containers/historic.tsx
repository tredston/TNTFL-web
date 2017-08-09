import * as React from 'react';
import { Component, Props } from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';
import * as QueryString from 'query-string';
import { LadderApi, LadderEntry } from 'tntfl-api';

import RangeSlider from '../components/range-slider';
import NavigationBar from '../components/navigation-bar';

import LadderPanel from '../components/ladder-panel';
import { getMonthName } from '../utils/utils';

interface MonthlyRankingProps {
  year: number;
  month: number;  // 0 indexed
  onClick: (d: Date) => void;
}
function Month(props: MonthlyRankingProps): JSX.Element {
  const { year, month, onClick } = props;
  return (
    <div>
      <a
        href='#'
        onClick={(e) => {
          e.preventDefault();
          onClick(new Date(year, month, 1));
        }}
      >
        {getMonthName(month)}
      </a>
    </div>
  );
}

interface MonthlyRankingsProps {
  year: number;
  onClick: (d: Date) => void;
}
function Year(props: MonthlyRankingsProps): JSX.Element {
  const { year, onClick } = props;
  const now = new Date();
  const numMonths = year !== now.getFullYear() ? 12 : now.getMonth() + 1;
  let months = Array.from(Array(numMonths).keys());
  // First game was in July 2005
  if (year === 2005) {
    months = months.slice(6);
  }
  return (
    <Col sm={3}>
      <Panel header={year}>
        {months.reverse().map((m, i) => <Month year={year} month={m} onClick={onClick} key={i}/>)}
      </Panel>
    </Col>
  );
}

function getEndOfMonth(startOfMonth: Date): Date {
  const december = startOfMonth.getMonth() === 11;
  const endYear = startOfMonth.getFullYear() + (december ? 1 : 0);
  const endMonth = december ? 0 : startOfMonth.getMonth() + 1;
  return new Date(endYear, endMonth, 1);
}

function dateToEpoch(d: Date): number {
  return Math.round(d.getTime() / 1000);
}

interface HistoricPageProps extends Props<HistoricPage> {
  base: string;
  gamesFrom?: number;
  gamesTo?: number;
}
interface HistoricPageState {
  entries?: LadderEntry[];
  gamesFrom?: number;
  gamesTo?: number;
}
export default class HistoricPage extends Component<HistoricPageProps, HistoricPageState> {
  constructor(props: HistoricPageProps, context: any) {
    super(props, context);
    this.state = {
      entries: undefined,
      gamesFrom: props.gamesFrom,
      gamesTo: props.gamesTo,
    };
  }
  async loadLadder(gamesFrom?: number, gamesTo?: number) {
    const { base } = this.props;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const begin = gamesFrom || dateToEpoch(startOfMonth);
    const end = gamesTo || dateToEpoch(getEndOfMonth(startOfMonth));
    const api = new LadderApi(fetch, base);
    const entries = await api.getLadderBetween({players: 1, showInactive: 1, begin, end});
    this.setState({entries} as HistoricPageState);
  }
  componentDidMount() {
    const { gamesFrom, gamesTo } = this.state;
    this.loadLadder(gamesFrom, gamesTo);
  }
  onMonthSelect(d: Date) {
    const gamesFrom = dateToEpoch(d);
    const gamesTo = dateToEpoch(getEndOfMonth(d));
    this.onRangeChange(gamesFrom, gamesTo);
  }
  onRangeChange(gamesFrom: number, gamesTo: number) {
    window.history.pushState('object or string', 'Title', `?gamesFrom=${gamesFrom}&gamesTo=${gamesTo}`);

    this.setState({
      entries: undefined,
      gamesFrom,
      gamesTo,
    } as HistoricPageState);
    this.loadLadder(gamesFrom, gamesTo);
  }
  render() {
    const { base } = this.props;
    const { entries, gamesFrom, gamesTo } = this.state;
    const now = (new Date()).getUTCFullYear();
    const firstYear = 2005;
    const years = Array.from(Array((now + 1) - firstYear).keys()).map(y => y + firstYear).reverse();
    const yearPanels = years.map((y, i) => <Year year={y} onClick={(d) => this.onMonthSelect(d)} key={i} />);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const fromTime = gamesFrom || dateToEpoch(startOfMonth);
    const toTime = gamesTo || dateToEpoch(getEndOfMonth(startOfMonth));

    return (
      <div>
        <NavigationBar
          base={base}
        />
        <Grid fluid={true}>
          <Panel>
            <RangeSlider
              gamesFrom={fromTime}
              gamesTo={toTime}
              id={'rangeSlider'}
              onChange={(f, t) => this.onRangeChange(f, t)}
            />
          </Panel>
          <Row>
            <Col lg={8}>
              <LadderPanel entries={entries} atDate={toTime} />
            </Col>
            <Col lg={4}>
              <Panel header={'Monthly Rankings'}>
                <Row>
                  {yearPanels}
                </Row>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function getParameters(): [number | undefined, number | undefined] {
  if (location.search !== '') {
    const params: any = QueryString.parse(location.search);
    return [+params.gamesFrom, +params.gamesTo];
  }
  return [undefined, undefined];
}

ReactDOM.render(
  <HistoricPage
    base={'./'}
    gamesFrom={getParameters()[0]}
    gamesTo={getParameters()[1]}
  />,
  document.getElementById('entry'),
);
