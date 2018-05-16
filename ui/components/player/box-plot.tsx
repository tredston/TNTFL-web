import * as React from 'react';
const ReactHighcharts = require('react-highcharts');
require('highcharts/highcharts-more')(ReactHighcharts.Highcharts);
const ReactBoxPlot = require('react-boxplot/dist');
const ContainerDimensions = require('react-container-dimensions').default;

interface Props {
  data: number[];
}
export default function BoxPlot(props: Props): JSX.Element {
  const { data } = props;
  const { whiskerLow, quartile1, quartile2, quartile3, whiskerHigh } = ReactBoxPlot.computeBoxplotStats(data);
  const config = {
    chart: {
      type: 'boxplot',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: [''],
    },
    yAxis: {
      title: {
        text: 'Skill',
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '',
      valueDecimals: 3,
    },
    series: [{
      data: [[whiskerLow, quartile1, quartile2, quartile3, whiskerHigh]],
    }],
  };

  return (
    <ContainerDimensions>
      {({height}: {height: number}) => {
        (config.chart as any).height = height;
        return (
          <div style={{ width: 120, margin: -15 }}>
            {data.length >= 5
              ? <ReactHighcharts config={config}/>
              : 'Not enough data'
            }
          </div>
        );
      }}
    </ContainerDimensions>
  );
}
