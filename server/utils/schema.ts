import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const matches = pgTable('matches', {
    id: uuid('id').defaultRandom().primaryKey(),
    date: timestamp('date').defaultNow().notNull(),
    result: text('result', { enum: ['Extraction', 'Death', 'Loss'] }).notNull(),
    totalKills: integer('total_kills').notNull().default(0),
    totalDeaths: integer('total_deaths').notNull().default(0),
    totalPlayers: integer('total_players').notNull().default(1),
    totalMoneyGained: integer('total_money_gained').notNull().default(0),
    bountyTokens: integer('bounty_tokens').notNull().default(0),
    map: text('map').notNull(),
});

export const playerPerformances = pgTable('player_performances', {
    id: uuid('id').defaultRandom().primaryKey(),
    matchId: uuid('match_id').references(() => matches.id, { onDelete: 'cascade' }).notNull(),
    playerName: text('player_name').notNull(),
    kills: integer('kills').notNull().default(0),
    deaths: integer('deaths').notNull().default(0),
    moneyGained: integer('money_gained').notNull().default(0),
});

export const matchesRelations = relations(matches, ({ many }) => ({
    playerPerformances: many(playerPerformances),
}));

export const playerPerformancesRelations = relations(playerPerformances, ({ one }) => ({
    match: one(matches, {
        fields: [playerPerformances.matchId],
        references: [matches.id],
    }),
}));
