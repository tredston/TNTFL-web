import * as React from 'react';
import { Component, Props } from 'react';
import { Player, GamesApi } from 'tntfl-api';

import StatRow from './stat-row';

interface PredictRowProps extends Props<PredictRow> {
  base: string;
  player1?: Player;
  player2?: Player;
}
interface PredictRowState {
  predictedBlueGoalRatio?: number;
}
export default class PredictRow extends Component<PredictRowProps, PredictRowState> {
  constructor(props: PredictRowProps, context: any) {
    super(props, context);
    this.state = {
      predictedBlueGoalRatio: undefined,
    };
  }
  async loadPrediction(props: PredictRowProps) {
    const { base, player1, player2 } = props;
    if (player1 !== undefined && player2 !== undefined) {
      const r = await new GamesApi(fetch, base).predict({redElo: player1.skill, blueElo: player2.skill});
      this.setState({predictedBlueGoalRatio: r.blueGoalRatio});
    }
  }
  componentDidMount() {
    this.loadPrediction(this.props);
  }
  componentWillReceiveProps(props: PredictRowProps) {
    this.loadPrediction(props);
  }
  render(): JSX.Element {
    const { predictedBlueGoalRatio } = this.state;
    if (predictedBlueGoalRatio === undefined) {
      return <StatRow name={'Predicted Result'} redValue={'Loading...'} blueValue={'Loading...'}/>;
    }
    const blueScore = Math.round(predictedBlueGoalRatio * 10);
    const redScore = 10 - blueScore;
    const redAhead = redScore > blueScore;
    const blueAhead = blueScore > redScore;
    return (
      <StatRow
        name={'Predicted Result'}
        redValue={redScore}
        blueValue={blueScore}
        redAhead={redAhead}
        blueAhead={blueAhead}
      />
    );
  }
}
