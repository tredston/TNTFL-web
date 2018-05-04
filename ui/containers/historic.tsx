import * as React from 'react';
import { Component, Props } from 'react';
import * as ReactDOM from 'react-dom';
import { Panel } from 'react-bootstrap';
import * as Moment from 'moment';
import * as QueryString from 'query-string';
import { LadderApi, LadderEntry } from 'tntfl-api';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import 'ion-rangeslider/css/ion.rangeSlider.skinModern.css';
import '../styles/style.less';

import RangeSlider from '../components/range-slider';
import NavigationBar from '../components/navigation-bar';
import LadderPanel from '../components/ladder-panel';
import { getMonthName } from '../utils/utils';

interface MonthlyRankingProps {
  year: number;
  month: number;  // 0 indexed
  onClick: (d: Moment.Moment) => void;
}
function Month(props: MonthlyRankingProps): JSX.Element {
  const { year, month, onClick } = props;
  return (
    <div>
      <a
        href='#'
        onClick={(e) => {
          e.preventDefault();
          onClick(Moment().year(year).month(month).date(1).hour(0).minute(0).second(0));
        }}
      >
        {getMonthName(month)}
      </a>
    </div>
  );
}

interface MonthlyRankingsProps {
  year: number;
  onClick: (d: Moment.Moment) => void;
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
    <Panel>
      <Panel.Heading>{year}</Panel.Heading>
      <Panel.Body>
        {months.reverse().map((m, i) => <Month year={year} month={m} onClick={onClick} key={i}/>)}
      </Panel.Body>
    </Panel>
  );
}

function getEndOfMonth(startOfMonth: Moment.Moment): Moment.Moment {
  return Moment(startOfMonth).date(31).hour(23).minute(59).second(59);
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
  getRange(gamesFrom: number | undefined, gamesTo: number | undefined): {begin: number, end: number} {
    const startOfMonth = Moment().date(1).hour(0).minute(0).second(0);
    const begin = gamesFrom || startOfMonth.unix();
    const end = gamesTo || getEndOfMonth(startOfMonth).unix();
    return { begin, end };
  }
  async loadLadder(gamesFrom: number | undefined, gamesTo: number | undefined) {
    const { base } = this.props;
    const { begin, end } = this.getRange(gamesFrom, gamesTo);
    const api = new LadderApi(fetch, base);
    const entries = await api.getLadderBetween({players: 1, showInactive: 1, begin, end});
    this.setState({entries} as HistoricPageState);
  }
  componentDidMount() {
    const { gamesFrom, gamesTo } = this.state;
    this.loadLadder(gamesFrom, gamesTo);
  }
  onMonthSelect(d: Moment.Moment) {
    const gamesFrom = d.unix();
    const gamesTo = getEndOfMonth(d).unix();
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
    const { begin: fromTime, end: toTime } = this.getRange(gamesFrom, gamesTo);

    return (
      <div>
        <NavigationBar
          base={base}
        />
        <div>
          <Panel style={{marginLeft: 20, marginRight: 20}}>
            <Panel.Body>
              <RangeSlider
                gamesFrom={fromTime}
                gamesTo={toTime}
                id={'rangeSlider'}
                onChange={(f, t) => this.onRangeChange(f, t)}
              />
            </Panel.Body>
          </Panel>
          <div className={'ladder-page'}>
            <div className={'ladder-panel'}>
              <LadderPanel entries={entries} />
            </div>
            <div className={'side-panel'}>
              <Panel>
                <Panel.Heading>Monthly Rankings</Panel.Heading>
                <Panel.Body>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gridColumnGap: 5}}>
                    {yearPanels}
                  </div>
                </Panel.Body>
              </Panel>
            </div>
          </div>
        </div>
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
    base={__tntfl_base_path__}
    gamesFrom={getParameters()[0]}
    gamesTo={getParameters()[1]}
  />,
  document.getElementById('entry'),
);
