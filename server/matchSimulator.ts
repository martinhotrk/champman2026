import { Player, Club } from "../drizzle/schema";

/**
 * Match Simulator
 * Simulates a football match based on player attributes
 * Generates narrative text describing key events
 */

interface MatchEvent {
  minute: number;
  type: "goal" | "chance" | "save" | "tackle" | "foul" | "substitution";
  team: "home" | "away";
  player: string;
  description: string;
}

interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  narrative: string;
}

/**
 * Calculate team strength based on average player attributes
 */
function calculateTeamStrength(players: Player[]): number {
  if (players.length === 0) return 50;

  const avgPace = players.reduce((sum, p) => sum + p.pace, 0) / players.length;
  const avgShooting = players.reduce((sum, p) => sum + p.shooting, 0) / players.length;
  const avgPassing = players.reduce((sum, p) => sum + p.passing, 0) / players.length;
  const avgDribbling = players.reduce((sum, p) => sum + p.dribbling, 0) / players.length;
  const avgDefense = players.reduce((sum, p) => sum + p.defense, 0) / players.length;
  const avgPhysical = players.reduce((sum, p) => sum + p.physical, 0) / players.length;

  return (avgPace + avgShooting + avgPassing + avgDribbling + avgDefense + avgPhysical) / 6;
}

/**
 * Calculate probability of goal based on team strength
 */
function calculateGoalProbability(attackingStrength: number, defendingStrength: number): number {
  const strengthDiff = attackingStrength - defendingStrength;
  const baseProbability = 0.05; // 5% base chance per minute

  // Adjust based on strength difference
  const adjustment = (strengthDiff / 100) * 0.05;
  return Math.max(0.01, Math.min(0.15, baseProbability + adjustment));
}

/**
 * Get random player name from a list
 */
function getRandomPlayer(players: Player[]): Player {
  return players[Math.floor(Math.random() * players.length)];
}

/**
 * Generate match events and narrative
 */
function generateMatchEvents(
  homeTeam: Player[],
  awayTeam: Player[],
  homeStrength: number,
  awayStrength: number
): { events: MatchEvent[]; homeGoals: number; awayGoals: number } {
  const events: MatchEvent[] = [];
  let homeGoals = 0;
  let awayGoals = 0;

  // Simulate 90 minutes
  for (let minute = 5; minute <= 90; minute += Math.random() * 5 + 2) {
    const roundedMinute = Math.floor(minute);

    // Home team attacking
    if (Math.random() < calculateGoalProbability(homeStrength, awayStrength)) {
      const scorer = getRandomPlayer(homeTeam);
      homeGoals++;
      events.push({
        minute: roundedMinute,
        type: "goal",
        team: "home",
        player: scorer.name,
        description: `⚽ GOOOOL! ${scorer.name} marca para o time da casa!`,
      });
    }

    // Away team attacking
    if (Math.random() < calculateGoalProbability(awayStrength, homeStrength)) {
      const scorer = getRandomPlayer(awayTeam);
      awayGoals++;
      events.push({
        minute: roundedMinute,
        type: "goal",
        team: "away",
        player: scorer.name,
        description: `⚽ GOOOOL! ${scorer.name} marca para o time visitante!`,
      });
    }

    // Other match events
    if (Math.random() < 0.3) {
      const eventType = Math.random() < 0.5 ? "chance" : "tackle";
      const player = Math.random() < 0.5 ? getRandomPlayer(homeTeam) : getRandomPlayer(awayTeam);
      const team = Math.random() < 0.5 ? "home" : "away";

      if (eventType === "chance") {
        events.push({
          minute: roundedMinute,
          type: "chance",
          team,
          player: player.name,
          description: `${player.name} desperdiça uma grande chance!`,
        });
      } else {
        events.push({
          minute: roundedMinute,
          type: "tackle",
          team,
          player: player.name,
          description: `${player.name} faz uma defesa importante.`,
        });
      }
    }
  }

  return { events, homeGoals, awayGoals };
}

/**
 * Generate narrative text from match events
 */
function generateNarrative(
  homeTeamName: string,
  awayTeamName: string,
  homeGoals: number,
  awayGoals: number,
  events: MatchEvent[]
): string {
  let narrative = `\n═══════════════════════════════════════\n`;
  narrative += `⚽ ${homeTeamName} ${homeGoals} × ${awayGoals} ${awayTeamName}\n`;
  narrative += `═══════════════════════════════════════\n\n`;

  if (events.length === 0) {
    narrative += `Uma partida equilibrada, mas sem grandes emoções. Ambos os times tiveram dificuldades para criar oportunidades claras.\n`;
  } else {
    narrative += `PRINCIPAIS MOMENTOS:\n`;
    narrative += `─────────────────────\n`;

    events.forEach((event) => {
      narrative += `${event.minute}' - ${event.description}\n`;
    });
  }

  narrative += `\n═══════════════════════════════════════\n`;

  if (homeGoals > awayGoals) {
    narrative += `✓ ${homeTeamName} vence em casa!\n`;
  } else if (awayGoals > homeGoals) {
    narrative += `✓ ${awayTeamName} vence fora de casa!\n`;
  } else {
    narrative += `= Empate! Ambos os times saem com um ponto.\n`;
  }

  narrative += `═══════════════════════════════════════\n`;

  return narrative;
}

/**
 * Simulate a complete match
 */
export async function simulateMatch(
  homeTeam: { club: Club; players: Player[] },
  awayTeam: { club: Club; players: Player[] }
): Promise<MatchResult> {
  const homeStrength = calculateTeamStrength(homeTeam.players);
  const awayStrength = calculateTeamStrength(awayTeam.players);

  const { events, homeGoals, awayGoals } = generateMatchEvents(
    homeTeam.players,
    awayTeam.players,
    homeStrength,
    awayStrength
  );

  const narrative = generateNarrative(
    homeTeam.club.shortName,
    awayTeam.club.shortName,
    homeGoals,
    awayGoals,
    events
  );

  return {
    homeGoals,
    awayGoals,
    events,
    narrative,
  };
}

/**
 * Update standings after a match
 */
export function updateStandingsAfterMatch(
  homeGoals: number,
  awayGoals: number
): { homePoints: number; awayPoints: number; homeWins: number; awayWins: number; draws: number } {
  if (homeGoals > awayGoals) {
    return { homePoints: 3, awayPoints: 0, homeWins: 1, awayWins: 0, draws: 0 };
  } else if (awayGoals > homeGoals) {
    return { homePoints: 0, awayPoints: 3, homeWins: 0, awayWins: 1, draws: 0 };
  } else {
    return { homePoints: 1, awayPoints: 1, homeWins: 0, awayWins: 0, draws: 1 };
  }
}
