// World Cup 2026 Data Store and Controller
import fallbackData from "./worldcup_fallback.json";

export const FALLBACK_TEAMS = fallbackData.teams;
export const FALLBACK_GROUPS = fallbackData.groups;
export const FALLBACK_GAMES = fallbackData.games;

const sanitizeId = val => val ? String(val).replace(/[^\w-]/g, "") : "";
const sanitizeUrl = val => (typeof val === "string" && /^https:\/\/flagcdn\.com\/w80\/[a-z-]+\.png$/i.test(val.trim())) ? val.trim() : "";
const sanitizeString = val => val ? String(val).replace(/<\/?[^>]+(>|$)/g, "").trim() : "";

/**
 * Sanitizes team details from raw input data.
 * @param {Array} teams Raw teams list
 * @returns {Array} Sanitized teams list
 */
const sanitizeTeams = teams => Array.isArray(teams) ? teams.map(t => ({
  id: sanitizeId(t.id),
  name_en: sanitizeString(t.name_en),
  name_fa: sanitizeString(t.name_fa),
  flag: sanitizeUrl(t.flag),
  fifa_code: String(t.fifa_code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3),
  iso2: String(t.iso2 || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 2),
  groups: String(t.groups || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 1)
})) : [];

/**
 * Sanitizes match game details from raw input data.
 * @param {Array} games Raw games list
 * @returns {Array} Sanitized games list
 */
const sanitizeGames = games => Array.isArray(games) ? games.map(g => ({
  id: sanitizeId(g.id),
  home_team_id: sanitizeId(g.home_team_id),
  away_team_id: sanitizeId(g.away_team_id),
  home_score: String(parseInt(g.home_score, 10) || 0),
  away_score: String(parseInt(g.away_score, 10) || 0),
  home_scorers: sanitizeString(g.home_scorers),
  away_scorers: sanitizeString(g.away_scorers),
  group: sanitizeString(g.group),
  matchday: sanitizeString(g.matchday),
  local_date: sanitizeString(g.local_date),
  persian_date: sanitizeString(g.persian_date),
  stadium_id: sanitizeId(g.stadium_id),
  finished: g.finished === "TRUE" ? "TRUE" : "FALSE",
  time_elapsed: sanitizeString(g.time_elapsed),
  type: sanitizeString(g.type),
  home_team_name_en: sanitizeString(g.home_team_name_en),
  home_team_name_fa: sanitizeString(g.home_team_name_fa),
  away_team_name_en: sanitizeString(g.away_team_name_en),
  away_team_name_fa: sanitizeString(g.away_team_name_fa),
  home_team_label: sanitizeString(g.home_team_label),
  away_team_label: sanitizeString(g.away_team_label)
})) : [];

/**
 * Sanitizes groups and internal team standings from raw input data.
 * @param {Array} groups Raw groups list
 * @returns {Array} Sanitized groups list
 */
const sanitizeGroups = groups => Array.isArray(groups) ? groups.map(g => ({
  name: sanitizeString(g.name),
  teams: Array.isArray(g.teams) ? g.teams.map(t => ({
    team_id: sanitizeId(t.team_id),
    mp: String(parseInt(t.mp, 10) || 0),
    w: String(parseInt(t.w, 10) || 0),
    l: String(parseInt(t.l, 10) || 0),
    d: String(parseInt(t.d, 10) || 0),
    pts: String(parseInt(t.pts, 10) || 0),
    gf: String(parseInt(t.gf, 10) || 0),
    ga: String(parseInt(t.ga, 10) || 0),
    gd: String(parseInt(t.gd, 10) || 0)
  })) : []
})) : [];

/**
 * Performs strict structural, bounds, and value validation on sanitized data.
 * Throws an Error if any structural invariant fails.
 * @param {Array} games Games list
 * @param {Array} teams Teams list
 * @param {Array} groups Groups list
 */
const validateData = (games, teams, groups) => {
  if (!Array.isArray(games) || games.length !== 104) {
    throw new Error("Invalid games count");
  }
  if (!Array.isArray(teams) || teams.length !== 48) {
    throw new Error("Invalid teams count");
  }
  if (!Array.isArray(groups) || groups.length !== 12) {
    throw new Error("Invalid groups count");
  }

  for (const g of games) {
    if (!g.id || !/^\d+$/.test(g.id)) throw new Error("Invalid game ID");
    const idNum = parseInt(g.id, 10);
    if (idNum < 1 || idNum > 104) throw new Error("Game ID out of bounds");

    const hs = parseInt(g.home_score, 10);
    const as = parseInt(g.away_score, 10);
    if (isNaN(hs) || hs < 0 || hs > 99 || isNaN(as) || as < 0 || as > 99) {
      throw new Error("Game score out of range");
    }

    if (g.finished !== "TRUE" && g.finished !== "FALSE") {
      throw new Error("Invalid finished flag");
    }
  }

  for (const t of teams) {
    if (!t.id || !/^\d+$/.test(t.id)) throw new Error("Invalid team ID");
    const idNum = parseInt(t.id, 10);
    if (idNum < 1 || idNum > 48) throw new Error("Team ID out of bounds");

    if (!t.groups || !/^[A-L]$/.test(t.groups)) {
      throw new Error("Invalid team group allocation");
    }
  }
};

/**
 * Controller class to manage the World Cup tournament state,
 * standings calculation, and bracket tree generation.
 */
export class WorldCupController {
  constructor(games = FALLBACK_GAMES, teams = FALLBACK_TEAMS, groups = FALLBACK_GROUPS) {
    const sanitizedGames = sanitizeGames(games);
    const sanitizedTeams = sanitizeTeams(teams);
    const sanitizedGroups = sanitizeGroups(groups);

    validateData(sanitizedGames, sanitizedTeams, sanitizedGroups);

    this.games = sanitizedGames;
    this.teams = sanitizedTeams;
    this.groups = sanitizedGroups;
    this.teamMap = new Map(this.teams.map(t => [t.id, t]));
    this.teamNameMap = new Map(this.teams.map(t => [t.name_en.toLowerCase(), t]));
  }

  getTeamById(id) {
    return this.teamMap.get(id.toString());
  }

  getTeamByName(name) {
    if (!name) return null;
    return this.teamNameMap.get(name.toLowerCase().trim());
  }

  /**
   * Sort group standings according to FIFA rules
   */
  calculateStandings() {
    const standings = {};
    // Initialise standings using the teams assigned to each group from the teams list
    for (const team of this.teams) {
      const gLetter = team.groups;
      if (!gLetter) continue;
      if (!standings[gLetter]) standings[gLetter] = [];
      standings[gLetter].push({
        teamId: team.id,
        name: team.name_en,
        flag: team.flag,
        fifaCode: team.fifa_code,
        mp: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0
      });
    }

    // Process finished games
    for (const g of this.games) {
      if (g.type !== "group" || g.finished !== "TRUE") continue;
      const gLetter = g.group;
      if (!gLetter || !standings[gLetter]) continue;

      const homeId = g.home_team_id;
      const awayId = g.away_team_id;
      const homeScore = parseInt(g.home_score) || 0;
      const awayScore = parseInt(g.away_score) || 0;

      const homeRow = standings[gLetter].find(r => r.teamId === homeId);
      const awayRow = standings[gLetter].find(r => r.teamId === awayId);

      if (homeRow && awayRow) {
        homeRow.mp += 1;
        awayRow.mp += 1;
        homeRow.gf += homeScore;
        homeRow.ga += awayScore;
        awayRow.gf += awayScore;
        awayRow.ga += homeScore;
        homeRow.gd = homeRow.gf - homeRow.ga;
        awayRow.gd = awayRow.gf - awayRow.ga;

        if (homeScore > awayScore) {
          homeRow.w += 1;
          homeRow.pts += 3;
          awayRow.l += 1;
        } else if (homeScore < awayScore) {
          awayRow.w += 1;
          awayRow.pts += 3;
          homeRow.l += 1;
        } else {
          homeRow.d += 1;
          homeRow.pts += 1;
          awayRow.d += 1;
          awayRow.pts += 1;
        }
      }
    }

    // Sort groups
    const sortedStandings = {};
    for (const letter of Object.keys(standings)) {
      sortedStandings[letter] = [...standings[letter]].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return b.w - a.w;
      });
    }

    return sortedStandings;
  }

  /**
   * Determine the best 3rd-place teams
   */
  getThirdPlaceStandings(standings = this.calculateStandings()) {
    const thirds = [];
    for (const letter of Object.keys(standings)) {
      const groupRows = standings[letter];
      if (groupRows.length >= 3) {
        thirds.push({
          group: letter,
          ...groupRows[2]
        });
      }
    }

    return thirds.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return b.w - a.w;
    });
  }

  /**
   * Get the status of all teams: 'IN' or 'OUT'
   */
  getTeamStatuses() {
    const statuses = {};
    for (const t of this.teams) {
      statuses[t.id] = "IN";
    }

    // Calculate group stage completion and elimination
    const standings = this.calculateStandings();
    const thirds = this.getThirdPlaceStandings(standings);
    const advancingThirds = new Set(thirds.slice(0, 8).map(t => t.teamId));

    for (const letter of Object.keys(standings)) {
      const groupRows = standings[letter];
      const finishedGroupMatches = this.games.filter(g => g.type === "group" && g.group === letter && g.finished === "TRUE");
      if (finishedGroupMatches.length === 6) {
        if (groupRows[3]) statuses[groupRows[3].teamId] = "OUT";
        if (groupRows[2] && !advancingThirds.has(groupRows[2].teamId)) {
          statuses[groupRows[2].teamId] = "OUT";
        }
      }
    }

    // Knockout stage elimination
    for (const g of this.games) {
      if (g.type === "group" || g.finished !== "TRUE") continue;

      const homeId = g.home_team_id;
      const awayId = g.away_team_id;
      if (!homeId || !awayId || homeId === "0" || awayId === "0") continue;

      const homeScore = parseInt(g.home_score) || 0;
      const awayScore = parseInt(g.away_score) || 0;

      if (homeScore > awayScore) {
        statuses[awayId] = "OUT";
      } else if (awayScore > homeScore) {
        statuses[homeId] = "OUT";
      } else {
        const winnerId = this.findProgressionWinner(g.id);
        if (winnerId) {
          if (winnerId === homeId) {
            statuses[awayId] = "OUT";
          } else if (winnerId === awayId) {
            statuses[homeId] = "OUT";
          }
        }
      }
    }

    return statuses;
  }

  /**
   * Helper to check who progressed from a draw match
   */
  findProgressionWinner(matchId) {
    const targetLabel = `Winner Match ${matchId}`;
    for (const g of this.games) {
      if (g.home_team_label === targetLabel && g.home_team_id && g.home_team_id !== "0") {
        return g.home_team_id;
      }
      if (g.away_team_label === targetLabel && g.away_team_id && g.away_team_id !== "0") {
        return g.away_team_id;
      }
    }
    return null;
  }

  /**
   * Build the bracket tree matches
   */
  getBracketMatches() {
    return {
      r32: this.games.filter(g => g.type === "r32"),
      r16: this.games.filter(g => g.type === "r16"),
      qf: this.games.filter(g => g.type === "qf"),
      sf: this.games.filter(g => g.type === "sf"),
      third: this.games.find(g => g.type === "third"),
      final: this.games.find(g => g.type === "final")
    };
  }
}
