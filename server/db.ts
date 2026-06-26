import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clubs, players, seasons, standings, matches, transfers, tactics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// CHAMP MAN 2026 QUERIES

export async function getClubsWithPlayers() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(clubs);
  return result;
}

export async function getPlayersByClub(clubId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(players).where(eq(players.clubId, clubId));
  return result;
}

export async function getSeasonByUserAndClub(userId: number, clubId: number, year: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(seasons)
    .where(and(eq(seasons.userId, userId), eq(seasons.clubId, clubId), eq(seasons.year, year)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getStandingsBySeason(seasonId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(standings)
    .where(eq(standings.seasonId, seasonId));

  return result;
}

export async function getMatchesByRound(seasonId: number, round: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(matches)
    .where(and(eq(matches.seasonId, seasonId), eq(matches.round, round)));

  return result;
}

export async function getMatchById(matchId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPlayerById(playerId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(players).where(eq(players.id, playerId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getClubById(clubId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}
