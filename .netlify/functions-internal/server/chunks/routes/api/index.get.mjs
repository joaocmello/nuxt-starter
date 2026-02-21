import { d as defineEventHandler, b as db } from '../../_/nitro.mjs';
import '@neondatabase/serverless';
import 'drizzle-orm/neon-http';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
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

const index_get = defineEventHandler(async (event) => {
  const allMatches = await db.query.matches.findMany({
    with: {
      playerPerformances: true
    },
    orderBy: (m, { desc }) => [desc(m.date)]
  });
  return allMatches.map((match) => ({
    id: match.id,
    date: match.date.toISOString(),
    result: match.result,
    totalKills: match.totalKills,
    totalDeaths: match.totalDeaths,
    totalPlayers: match.totalPlayers,
    totalMoneyGained: match.totalMoneyGained,
    bossesBanished: match.bossesBanished,
    map: match.map,
    performance: match.playerPerformances.reduce((acc, p) => {
      acc[p.playerName] = {
        kills: p.kills,
        deaths: p.deaths,
        moneyGained: p.moneyGained
      };
      return acc;
    }, {})
  }));
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
