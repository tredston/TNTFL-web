import * as React from 'react';
import * as ReactDOM from 'react-dom';

import GamesPage from './components/games-page';
import { getParameters } from './utils/utils';

ReactDOM.render(
  <GamesPage
    base={'../../../'}
    addURL={'game/add'}
    getUrl={`player.cgi?view=json&player=${getParameters(2)[0]}&method=games`}
    title={`${getParameters(2)[0]}'s Games`}
  />,
  document.getElementById('entry')
);
