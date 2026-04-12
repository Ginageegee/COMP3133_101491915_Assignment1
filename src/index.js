require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const authContext = require('./middleware/auth');

const startServer = async () => {
    const app = express();

    // Enable CORS (allow frontend to connect)
    app.use(cors());

    // Optional: root route (so "/" doesn't error)
    app.get('/', (req, res) => {
        res.send('Backend is running');
    });

    // Connect MongoDB
    await connectDB();

    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => authContext(req),
        cache: "bounded" // prevents warning about unbounded cache
    });

    await server.start();

    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}${server.graphqlPath}`);
    });
};

startServer();