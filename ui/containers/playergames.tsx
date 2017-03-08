import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GamesPage from '../components/games-page';
import { getParameters } from '../utils/utils';

ReactDOM.render(
  <GamesPage
    base={'../../../'}
    addURL={'game/add'}
    getUrl={`${window.location.href}json`}
    title={`${getParameters(2)[0]}'s Games`}
  />,
  document.getElementById('entry')
);
