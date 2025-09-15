import { env } from './config/env';
import { app } from './main/express/server';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});