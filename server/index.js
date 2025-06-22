import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router as perplexityRouter } from './routes/perplexity.js';
import claudeRouter from './routes/claude.js';
import { connectToMongoDB, closeConnection } from './utils/mongodb.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())

app.use('/perplexity', perplexityRouter);
app.use('/claude', claudeRouter);

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

// Initialize MongoDB connection when app starts
async function startServer() {
  try {
    await connectToMongoDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await closeConnection();
  process.exit(0);
});

startServer();
