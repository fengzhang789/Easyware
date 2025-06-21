require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001;
const cors = require('cors')

const perplexityRouter = require('./routes/perplexity');
const { connectToMongoDB, closeConnection } = require('./utils/mongodb');

app.use(cors())
app.use(express.json())

app.use('/perplexity', perplexityRouter);

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
