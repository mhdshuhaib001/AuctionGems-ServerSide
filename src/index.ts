import { createServer } from "./infrastructure/config/app"; 
import { DBconfig } from "./infrastructure/config/DBconfig";
import dotenv from 'dotenv';

dotenv.config();

console.log(`Port from environment: ${process.env.PORT}`);

const startServer = async () => {
  try {
    await DBconfig();
    const port = process.env.PORT || 3000;
    const url = `http://localhost:${port}`;

    const app = createServer();
    app.listen(port, () => 
      console.log(`Server running at ${url}`)
    );
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
