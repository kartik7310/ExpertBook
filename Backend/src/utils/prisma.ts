import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const connectionString = process.env.DATABASE_URL;


const pool = new pg.Pool({
    connectionString,
    max: 50,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
    logger.info(' PostgreSQL Pool connected');
});

pool.on('error', (err) => {
    logger.error(' PostgreSQL Pool Error:', err);
});

const adapter = new PrismaPg(pool);


const prisma = new PrismaClient({
    adapter,
    log: ['info', 'warn', 'error']
});

export default prisma;
