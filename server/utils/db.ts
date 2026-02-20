import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const getDatabaseUrl = () => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is not defined in environment variables');
        throw new Error('DATABASE_URL is missing');
    }
    return url;
};

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
