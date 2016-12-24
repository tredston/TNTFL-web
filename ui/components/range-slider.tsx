import * as React from 'react';
import { Component, Props } from 'react';
let $ = require("jquery");
import * as moment from 'moment';
let slider = require('ion-rangeslider');

interface RangeSliderProps extends Props<RangeSlider> {
  id: string;
  gamesFrom: number;
  gamesTo: number;
  onChange: (from: number, to: number) => void;
}
export default class RangeSlider extends Component<RangeSliderProps, {}> {
  componentDidMount() {
    const { gamesFrom, gamesTo, onChange } = this.props;
    $('#rangeSlider').ionRangeSlider({
        type: "double",
        grid: true,
        force_edges: true,
        min: moment(1120176000, 'X').format('X'),
        max: moment().format('X'),
        from: gamesFrom,
        to: gamesTo,
        prettify: function (num: any) {
          return moment(num, 'X').format('LL');
        },
        onFinish: function (data: any) {
          onChange(data.from, data.to);
        }
    });
  }
  render(): JSX.Element {
    return (
      <input type="text" id={this.props.id} />
    );
  }
}
