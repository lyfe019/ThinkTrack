import { app } from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`[Bric Monolith]: Running at http://${config.host}:${config.port}`);
});
