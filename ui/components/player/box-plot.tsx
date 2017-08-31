import * as React from 'react';
const ReactHighcharts = require('react-highcharts');
require('highcharts/highcharts-more')(ReactHighcharts.Highcharts);
const computeBoxplotStats = require('react-boxplot/dist/stats');
const ContainerDimensions = require('react-container-dimensions').default;

interface Props {
  data: number[];
}
export default function BoxPlot(props: Props): JSX.Element {
  const { data } = props;
  const { whiskerLow, quartile1, quartile2, quartile3, whiskerHigh } = computeBoxplotStats(data);
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
        (config.chart as any).height = height - 50;
        return (
          <div style={{ width: 120, height: '100%', margin: -15 }}>
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
