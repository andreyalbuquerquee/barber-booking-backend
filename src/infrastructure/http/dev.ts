import { app } from './server';
import { env } from '../../config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});