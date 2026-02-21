import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { matches, playerPerformances } from '../../utils/schema';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        console.log('Adding new match (no transaction):', body);

        // 1. Insert the match
        const results = await db.insert(matches).values({
            result: body.result,
            totalKills: body.totalKills,
            totalDeaths: body.totalDeaths,
            totalPlayers: body.totalPlayers,
            totalMoneyGained: body.totalMoneyGained,
            bountyTokens: body.bountyTokens,
            map: body.map,
        }).returning();

        const newMatch = results[0];

        if (!newMatch) {
            throw new Error('Failed to create match record');
        }

        // 2. Insert player performances
        try {
            if (body.performance && Object.keys(body.performance).length > 0) {
                const perfData = Object.entries(body.performance).map(([playerName, stats]: [string, any]) => ({
                    matchId: newMatch.id,
                    playerName,
                    kills: stats.kills,
                    deaths: stats.deaths,
                    moneyGained: stats.moneyGained,
                }));

                await db.insert(playerPerformances).values(perfData);
            }
        } catch (perfError) {
            console.error('Error inserting player performances, attempting to rollback match:', perfError);
            // Attempt manual "rollback"
            await db.delete(matches).where(eq(matches.id, newMatch.id));
            throw perfError;
        }

        return newMatch;
    } catch (error: any) {
        console.error('Error in POST /api/matches:', error);
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Internal Server Error',
            data: error
        });
    }
});
