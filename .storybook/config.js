import { configure } from '@storybook/react';

const req = require.context('../ui', true, /\.story\.(js|jsx|ts|tsx)$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
