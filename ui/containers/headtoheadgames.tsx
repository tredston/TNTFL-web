import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../styles/style.less';

import GamesPage from './games-page';
import { getParameters } from '../utils/utils';

ReactDOM.render(
  <GamesPage
    getUrl={`${window.location.href}/json`}
    title={`${getParameters(3)[0]} vs ${getParameters(3)[1]}`}
  />,
  document.getElementById('entry'),
);
