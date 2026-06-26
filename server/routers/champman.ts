import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getClubsWithPlayers,
  getPlayersByClub,
  getSeasonByUserAndClub,
  getStandingsBySeason,
  getMatchesByRound,
  getMatchById,
  getPlayerById,
  getClubById,
  getDb,
} from "../db";
import { clubs, players, seasons, matches, standings, transfers } from "../../drizzle/schema";
import { simulateMatch, updateStandingsAfterMatch } from "../matchSimulator";
import { eq, and } from "drizzle-orm";

export const champmanRouter = router({
  // Get all clubs
  getClubs: protectedProcedure.query(async () => {
    return await getClubsWithPlayers();
  }),

  // Create a new season
  createSeason: protectedProcedure
    .input(
      z.object({
        clubId: z.number(),
        year: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if season already exists
      const existing = await getSeasonByUserAndClub(ctx.user.id, input.clubId, input.year);
      if (existing) {
        throw new Error("Season already exists for this club and year");
      }

      // Create new season with initial budget
      const result = await db.insert(seasons).values({
        userId: ctx.user.id,
        clubId: input.clubId,
        year: input.year,
        currentRound: 0,
        budget: "10000000", // 10 million initial budget
        status: "active",
      });

      // Get the inserted season
      const newSeason = await getSeasonByUserAndClub(ctx.user.id, input.clubId, input.year);
      return newSeason;
    }),

  // Get user's active season
  getActiveSeason: protectedProcedure
    .input(
      z.object({
        clubId: z.number(),
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await getSeasonByUserAndClub(ctx.user.id, input.clubId, input.year);
    }),

  // Get club details with players
  getClubDetails: protectedProcedure
    .input(z.object({ clubId: z.number() }))
    .query(async ({ input }) => {
      const club = await getClubById(input.clubId);
      const players = await getPlayersByClub(input.clubId);
      return { club, players };
    }),

  // Get standings for a season
  getStandings: protectedProcedure
    .input(z.object({ seasonId: z.number() }))
    .query(async ({ input }) => {
      return await getStandingsBySeason(input.seasonId);
    }),

  // Get matches for a specific round
  getMatches: protectedProcedure
    .input(
      z.object({
        seasonId: z.number(),
        round: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await getMatchesByRound(input.seasonId, input.round);
    }),

  // Simulate a match
  simulateMatchMutation: protectedProcedure
    .input(
      z.object({
        matchId: z.number(),
        seasonId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const match = await getMatchById(input.matchId);
      if (!match) throw new Error("Match not found");

      // Get home and away team players
      const homeTeamPlayers = await getPlayersByClub(match.homeClubId);
      const awayTeamPlayers = await getPlayersByClub(match.awayClubId);

      const homeClub = await getClubById(match.homeClubId);
      const awayClub = await getClubById(match.awayClubId);

      if (!homeClub || !awayClub) throw new Error("Clubs not found");

      // Simulate the match
      const result = await simulateMatch(
        { club: homeClub, players: homeTeamPlayers },
        { club: awayClub, players: awayTeamPlayers }
      );

      // Update match with results
      await db
        .update(matches)
        .set({
          homeGoals: result.homeGoals,
          awayGoals: result.awayGoals,
          narrative: result.narrative,
          status: "completed",
        })
        .where(eq(matches.id, input.matchId));

      // Update standings
      const standingsUpdate = updateStandingsAfterMatch(result.homeGoals, result.awayGoals);

      // Get current standings
      const homeStanding = await db
        .select()
        .from(standings)
        .where(
          and(eq(standings.seasonId, input.seasonId), eq(standings.clubId, match.homeClubId))
        )
        .limit(1);

      const awayStanding = await db
        .select()
        .from(standings)
        .where(
          and(eq(standings.seasonId, input.seasonId), eq(standings.clubId, match.awayClubId))
        )
        .limit(1);

      // Update home team standing
      if (homeStanding.length > 0) {
        const newHomeStanding = homeStanding[0];
        await db
          .update(standings)
          .set({
            played: newHomeStanding.played + 1,
            wins: newHomeStanding.wins + standingsUpdate.homeWins,
            draws: newHomeStanding.draws + standingsUpdate.draws,
            losses: newHomeStanding.losses + (1 - standingsUpdate.homeWins - standingsUpdate.draws),
            goalsFor: newHomeStanding.goalsFor + result.homeGoals,
            goalsAgainst: newHomeStanding.goalsAgainst + result.awayGoals,
            points: newHomeStanding.points + standingsUpdate.homePoints,
          })
          .where(eq(standings.id, newHomeStanding.id));
      }

      // Update away team standing
      if (awayStanding.length > 0) {
        const newAwayStanding = awayStanding[0];
        await db
          .update(standings)
          .set({
            played: newAwayStanding.played + 1,
            wins: newAwayStanding.wins + standingsUpdate.awayWins,
            draws: newAwayStanding.draws + standingsUpdate.draws,
            losses: newAwayStanding.losses + (1 - standingsUpdate.awayWins - standingsUpdate.draws),
            goalsFor: newAwayStanding.goalsFor + result.awayGoals,
            goalsAgainst: newAwayStanding.goalsAgainst + result.homeGoals,
            points: newAwayStanding.points + standingsUpdate.awayPoints,
          })
          .where(eq(standings.id, newAwayStanding.id));
      }

      return {
        match: {
          ...match,
          homeGoals: result.homeGoals,
          awayGoals: result.awayGoals,
          narrative: result.narrative,
          status: "completed",
        },
        result,
      };
    }),

  // Get player details
  getPlayerDetails: protectedProcedure
    .input(z.object({ playerId: z.number() }))
    .query(async ({ input }) => {
      return await getPlayerById(input.playerId);
    }),

  // Get all players available for transfer (international + bench players)
  getTransferMarket: protectedProcedure
    .input(z.object({ seasonId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Get international players
      const result = await db
        .select()
        .from(players)
        .where(eq(players.isInternational, true));

      return result;
    }),

  // Propose a transfer
  proposeTransfer: protectedProcedure
    .input(
      z.object({
        seasonId: z.number(),
        playerId: z.number(),
        toClubId: z.number(),
        transferType: z.enum(["buy", "sell", "loan"]),
        fee: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const player = await getPlayerById(input.playerId);
      if (!player) throw new Error("Player not found");

      const result = await db.insert(transfers).values({
        seasonId: input.seasonId,
        playerId: input.playerId,
        fromClubId: player.clubId,
        toClubId: input.toClubId,
        transferType: input.transferType,
        fee: input.fee ? input.fee.toString() : null,
        status: "pending",
      });

      return result;
    }),

  // Complete a transfer
  completeTransfer: protectedProcedure
    .input(
      z.object({
        transferId: z.number(),
        approved: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (input.approved) {
        // Get transfer details
        const transferResult = await db
          .select()
          .from(transfers)
          .where(eq(transfers.id, input.transferId))
          .limit(1);

        if (transferResult.length === 0) throw new Error("Transfer not found");

        const transfer = transferResult[0];

        // Update player's club
        await db
          .update(players)
          .set({ clubId: transfer.toClubId })
          .where(eq(players.id, transfer.playerId));

        // Update transfer status
        await db
          .update(transfers)
          .set({ status: "completed", completedAt: new Date() })
          .where(eq(transfers.id, input.transferId));
      } else {
        // Reject transfer
        await db
          .update(transfers)
          .set({ status: "rejected" })
          .where(eq(transfers.id, input.transferId));
      }

      return { success: true };
    }),
});
