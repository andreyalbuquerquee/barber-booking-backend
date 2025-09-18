import { env } from '../../../config/env';
import { app } from './app';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});