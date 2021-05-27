import app from './app';

import appConfig from '../../config/app';

app.listen(appConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running in *:${appConfig.port}`);
});
