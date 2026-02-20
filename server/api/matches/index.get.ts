import { db } from '../../utils/db';

export default defineEventHandler(async (event) => {
    const allMatches = await db.query.matches.findMany({
        with: {
            playerPerformances: true,
        },
        orderBy: (m, { desc }) => [desc(m.date)],
    });

    // Transform the data to match the frontend interface
    return allMatches.map(match => ({
        id: match.id,
        date: match.date.toISOString(),
        result: match.result,
        totalKills: match.totalKills,
        totalDeaths: match.totalDeaths,
        totalPlayers: match.totalPlayers,
        totalMoneyGained: match.totalMoneyGained,
        bossesBanished: match.bossesBanished,
        map: match.map,
        performance: (match as any).playerPerformances.reduce((acc: any, p: any) => {
            acc[p.playerName] = {
                kills: p.kills,
                deaths: p.deaths,
                moneyGained: p.moneyGained,
            };
            return acc;
        }, {}),
    }));
});
