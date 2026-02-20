import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const getDatabaseUrl = () => {
    const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL or NETLIFY_DATABASE_URL is not defined in environment variables');
        throw new Error('Database connection string is missing');
    }
    return url;
};

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
