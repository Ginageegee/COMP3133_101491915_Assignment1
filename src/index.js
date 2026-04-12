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

    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };

    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    app.get('/', (req, res) => {
        res.send('Backend is running');
    });

    await connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => authContext(req),
        cache: 'bounded'
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: false
    });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}${server.graphqlPath}`);
    });
};

startServer();