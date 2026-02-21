import { d as defineEventHandler, r as readBody, b as db, m as matches, p as playerPerformances, c as createError } from '../../_/nitro.mjs';
import { eq } from 'drizzle-orm';
import '@neondatabase/serverless';
import 'drizzle-orm/neon-http';
import 'drizzle-orm/pg-core';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';

const index_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Adding new match (no transaction):", body);
    const results = await db.insert(matches).values({
      result: body.result,
      totalKills: body.totalKills,
      totalDeaths: body.totalDeaths,
      totalPlayers: body.totalPlayers,
      totalMoneyGained: body.totalMoneyGained,
      bossesBanished: body.bossesBanished,
      map: body.map
    }).returning();
    const newMatch = results[0];
    if (!newMatch) {
      throw new Error("Failed to create match record");
    }
    try {
      if (body.performance && Object.keys(body.performance).length > 0) {
        const perfData = Object.entries(body.performance).map(([playerName, stats]) => ({
          matchId: newMatch.id,
          playerName,
          kills: stats.kills,
          deaths: stats.deaths,
          moneyGained: stats.moneyGained
        }));
        await db.insert(playerPerformances).values(perfData);
      }
    } catch (perfError) {
      console.error("Error inserting player performances, attempting to rollback match:", perfError);
      await db.delete(matches).where(eq(matches.id, newMatch.id));
      throw perfError;
    }
    return newMatch;
  } catch (error) {
    console.error("Error in POST /api/matches:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
      data: error
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
