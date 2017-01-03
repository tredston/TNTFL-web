import * as React from 'react';
import { Component, Props, CSSProperties } from 'react';
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import RangeSlider from './components/range-slider';
import RecentGames from './components/recent-game-list';
import NavigationBar from './components/navigation-bar';
import Game from './model/game';

import Ladder from './components/ladder';
import LadderEntry from './model/ladder-entry';
import { getParameters, getMonthName } from './utils/utils';

interface MonthlyRankingProps {
  year: number;
  month: number;  //0 indexed
  onClick: (d: Date) => void;
}
function Month(props: MonthlyRankingProps): JSX.Element {
  const { year, month, onClick } = props;
  return (
    <div>
      <a
        href="#"
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
  const now = new Date;
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

interface HistoricPageProps extends Props<HistoricPage> {
  base: string;
  addURL: string;
  gamesFrom: number;
  gamesTo: number;
}
interface HistoricPageState {
  entries: LadderEntry[];
  showInactive: boolean;
  gamesFrom: number;
  gamesTo: number;
}
export default class HistoricPage extends Component<HistoricPageProps, HistoricPageState> {
  constructor(props: HistoricPageProps, context: any) {
    super(props, context);
    this.state = {
      entries: undefined,
      showInactive: false,
      gamesFrom: undefined,
      gamesTo: undefined,
    }
  }
  async loadLadder(showInactive: boolean, gamesFrom: number, gamesTo: number) {
    const { base } = this.props;
    let url = `${base}ladder.cgi?view=json&players=1&gamesFrom=${gamesFrom}&gamesTo=${gamesTo}`;
    if (showInactive === true) {
      url += '&showInactive=1';
    }
    const r = await fetch(url);
    this.setState({entries: await r.json()} as HistoricPageState);
  }
  componentDidMount() {
    const { showInactive, gamesFrom, gamesTo } = this.state;
    this.loadLadder(showInactive, gamesFrom, gamesTo);
  }
  onShowInactive() {
    const { showInactive, gamesFrom, gamesTo } = this.state;
    const newState = !showInactive;
    this.setState({showInactive: newState} as HistoricPageState);
    this.loadLadder(newState, gamesFrom, gamesTo);
  }
  onMonthSelect(d: Date) {
    const gamesFrom = d.getTime() / 1000;
    const gamesTo = getEndOfMonth(d).getTime() / 1000;
    this.onRangeChange(gamesFrom, gamesTo);
  }
  onRangeChange(gamesFrom: number, gamesTo: number) {
    window.history.pushState("object or string", "Title", `?gamesFrom=${gamesFrom}&gamesTo=${gamesTo}`);

    const { showInactive } = this.state;
    this.setState({
      gamesFrom,
      gamesTo,
    } as HistoricPageState);
    this.loadLadder(showInactive, gamesFrom, gamesTo);
  }
  render() {
    const { addURL, base } = this.props;
    const { entries, showInactive } = this.state;
    const now = (new Date()).getUTCFullYear();
    const firstYear = 2005;
    const years = Array.from(Array((now + 1) - firstYear).keys()).map(y => y + firstYear).reverse();
    const yearPanels = years.map((y, i) => <Year year={y} onClick={(d) => this.onMonthSelect(d)} key={i} />);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = getEndOfMonth(startOfMonth);
    const fromTime = this.state.gamesFrom || Math.round(startOfMonth.getTime() / 1000);
    const toTime = this.state.gamesTo || endOfMonth.getTime() / 1000;

    return (
      <div>
        <NavigationBar
          base={base}
          addURL={addURL}
        />
        <Grid fluid={true}>
          <Panel>
            <RangeSlider gamesFrom={fromTime} gamesTo={toTime} id={'rangeSlider'} onChange={(f, t) => this.onRangeChange(f, t)}/>
          </Panel>
          <Row>
            <Col lg={8}>
              <Panel>
                {entries
                  ? <div>
                      <Ladder entries={entries} atDate={toTime}/>
                      <Button onClick={() => this.onShowInactive()} style={{width: '100%'}}>
                        {showInactive ? 'Hide inactive' : 'Show inactive'}
                      </Button>
                    </div>
                  : 'Loading...'
                }
              </Panel>
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

ReactDOM.render(
  <HistoricPage
    base={''}
    addURL={'game/add'}
    gamesFrom={+getParameters(2)[0]}
    gamesTo={+getParameters(2)[1]}
  />,
  document.getElementById('entry')
);
