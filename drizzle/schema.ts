import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// CHAMP MAN 2026 TABLES

export const clubs = mysqlTable("clubs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("shortName", { length: 50 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  marketValue: decimal("marketValue", { precision: 10, scale: 2 }),
  avgAge: decimal("avgAge", { precision: 4, scale: 1 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;

export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 50 }).notNull(), // GK, CB, LB, RB, CM, CAM, CDM, LW, RW, ST, CF
  nationality: varchar("nationality", { length: 100 }).notNull(),
  age: int("age").notNull(),
  clubId: int("clubId"),
  marketValue: decimal("marketValue", { precision: 10, scale: 2 }),
  
  // Player Attributes (0-100 scale)
  pace: int("pace").notNull().default(50),
  shooting: int("shooting").notNull().default(50),
  passing: int("passing").notNull().default(50),
  dribbling: int("dribbling").notNull().default(50),
  defense: int("defense").notNull().default(50),
  physical: int("physical").notNull().default(50),
  
  isInternational: boolean("isInternational").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export const seasons = mysqlTable("seasons", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clubId: int("clubId").notNull(),
  year: int("year").notNull(),
  currentRound: int("currentRound").notNull().default(0),
  budget: decimal("budget", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["active", "completed", "paused"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Season = typeof seasons.$inferSelect;
export type InsertSeason = typeof seasons.$inferInsert;

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  seasonId: int("seasonId").notNull(),
  round: int("round").notNull(),
  homeClubId: int("homeClubId").notNull(),
  awayClubId: int("awayClubId").notNull(),
  homeGoals: int("homeGoals"),
  awayGoals: int("awayGoals"),
  status: mysqlEnum("status", ["scheduled", "playing", "completed"]).default("scheduled"),
  narrative: text("narrative"), // Narrativa em texto da partida
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

export const standings = mysqlTable("standings", {
  id: int("id").autoincrement().primaryKey(),
  seasonId: int("seasonId").notNull(),
  clubId: int("clubId").notNull(),
  position: int("position"),
  played: int("played").notNull().default(0),
  wins: int("wins").notNull().default(0),
  draws: int("draws").notNull().default(0),
  losses: int("losses").notNull().default(0),
  goalsFor: int("goalsFor").notNull().default(0),
  goalsAgainst: int("goalsAgainst").notNull().default(0),
  goalDifference: int("goalDifference").notNull().default(0),
  points: int("points").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Standing = typeof standings.$inferSelect;
export type InsertStanding = typeof standings.$inferInsert;

export const transfers = mysqlTable("transfers", {
  id: int("id").autoincrement().primaryKey(),
  seasonId: int("seasonId").notNull(),
  playerId: int("playerId").notNull(),
  fromClubId: int("fromClubId"),
  toClubId: int("toClubId").notNull(),
  transferType: mysqlEnum("transferType", ["buy", "sell", "loan"]).notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pending", "completed", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = typeof transfers.$inferInsert;

export const tactics = mysqlTable("tactics", {
  id: int("id").autoincrement().primaryKey(),
  seasonId: int("seasonId").notNull(),
  matchId: int("matchId"),
  formation: varchar("formation", { length: 20 }).notNull(), // 4-3-3, 4-2-3-1, 3-5-2, etc
  lineup: json("lineup"), // Array of player IDs in formation order
  tactics: varchar("tactics", { length: 100 }), // aggressive, defensive, balanced, etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tactic = typeof tactics.$inferSelect;
export type InsertTactic = typeof tactics.$inferInsert;