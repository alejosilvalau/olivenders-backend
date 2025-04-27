import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PUERTO_POR_DEFECTO, () => {
  console.log(`Example app listening on port ${process.env.PUERTO_POR_DEFECTO}`);
});
