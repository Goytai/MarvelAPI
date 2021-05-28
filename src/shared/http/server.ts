import app from './app';

import appConfig from '../../config/app';

app.listen(appConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server running on ${process.env.NODE_ENV} in *:${appConfig.port}`
  );
});
