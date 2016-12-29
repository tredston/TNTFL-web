import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GamesPage from './components/games-page';
import { getParameters } from './utils/utils';

ReactDOM.render(
  <GamesPage
    base={'../../../../'}
    addURL={'game/add'}
    getUrl={`headtohead.cgi?view=json&player1=${getParameters(3)[0]}&player2=${getParameters(3)[1]}&method=games`}
    title={`${getParameters(3)[0]} vs ${getParameters(3)[1]}`}
  />,
  document.getElementById('entry')
);
