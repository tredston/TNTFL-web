import * as React from 'react';
import { Component, Props } from 'react';
let $ = require('jquery');
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
    const { id, gamesFrom, gamesTo, onChange } = this.props;
    $(`#${id}`).ionRangeSlider({
        type: 'double',
        grid: true,
        force_edges: true,
        min: moment(1120176000, 'X').format('X'),
        max: moment().format('X'),
        from: gamesFrom,
        to: gamesTo,
        prettify: (num: any) => {
          return moment(num, 'X').format('LL');
        },
        onFinish: (data: any) => {
          onChange(data.from, data.to);
        },
    });
  }
  componentDidUpdate() {
    const { id, gamesFrom, gamesTo } = this.props;
    $(`#${id}`).data('ionRangeSlider').update({from: gamesFrom, to: gamesTo});
  }
  render(): JSX.Element {
    return (
      <input type='text' id={this.props.id} />
    );
  }
}
