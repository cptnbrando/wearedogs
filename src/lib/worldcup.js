// World Cup 2026 Data Store and Controller
import fallbackData from "./worldcup_fallback.json";

export const FALLBACK_TEAMS = fallbackData.teams;
export const FALLBACK_GROUPS = fallbackData.groups;
export const FALLBACK_GAMES = fallbackData.games;

/**
 * Controller class to manage the World Cup tournament state,
 * standings calculation, and bracket tree generation.
 */
export class WorldCupController {
  constructor(games = FALLBACK_GAMES, teams = FALLBACK_TEAMS, groups = FALLBACK_GROUPS) {
    this.games = games;
    this.teams = teams;
    this.groups = groups;
    this.teamMap = new Map(teams.map(t => [t.id, t]));
    this.teamNameMap = new Map(teams.map(t => [t.name_en.toLowerCase(), t]));
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
