/**
 * FIELDVERSE Smart Fixture Engine
 * Rules-based deterministic tournament fixture generation and conflict detection.
 * Pure Vanilla JavaScript implementation.
 */

export class SmartFixtureEngine {
  /**
   * Generates a single-elimination Knockout tournament bracket
   * @param {Array} teams - Array of approved team objects
   * @param {Object} config - { eventId, venueId, startDate, matchTimes, matchDurationMins }
   */
  static generateKnockout(teams, config) {
    if (!teams || teams.length < 2) {
      throw new Error('At least 2 approved teams are required to generate fixtures.');
    }

    const numTeams = teams.length;
    // Calculate nearest power of 2 >= numTeams
    let bracketSize = 2;
    while (bracketSize < numTeams) {
      bracketSize *= 2;
    }

    const numByes = bracketSize - numTeams;
    const shuffledTeams = [...teams]; // Can optionally preserve seeding or shuffle

    // Determine round names
    const getRoundName = (teamsInRound) => {
      if (teamsInRound === 2) return 'Final';
      if (teamsInRound === 4) return 'Semi-Finals';
      if (teamsInRound === 8) return 'Quarter-Finals';
      return `Round of ${teamsInRound}`;
    };

    const fixtures = [];
    let matchNumber = 1;
    let currentDate = new Date(config.startDate || Date.now());
    const matchTimes = config.matchTimes || ['09:00', '13:00', '16:30', '19:30'];
    let timeIndex = 0;

    // In Round 1, teams without byes play
    // Total matches in Round 1 = (numTeams - numByes) / 2
    const numRound1Matches = (numTeams - numByes) / 2;
    const round1Teams = shuffledTeams.slice(0, numRound1Matches * 2);
    const byeTeams = shuffledTeams.slice(numRound1Matches * 2);

    const round1Name = getRoundName(bracketSize);

    // Create Round 1 fixtures
    for (let i = 0; i < round1Teams.length; i += 2) {
      const time = matchTimes[timeIndex % matchTimes.length];
      if (timeIndex > 0 && timeIndex % matchTimes.length === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      fixtures.push({
        event_id: config.eventId,
        round_name: numByes > 0 ? 'Preliminary Round' : round1Name,
        match_number: matchNumber++,
        team_a_id: round1Teams[i].id,
        team_b_id: round1Teams[i + 1].id,
        team_a_name: round1Teams[i].name,
        team_b_name: round1Teams[i + 1].name,
        venue_id: config.venueId,
        match_date: currentDate.toISOString().split('T')[0],
        start_time: time,
        status: 'scheduled',
        score_summary: 'Upcoming'
      });
      timeIndex++;
    }

    // Schedule subsequent round placeholders
    let remainingTeams = bracketSize / 2;
    while (remainingTeams >= 2) {
      const roundName = getRoundName(remainingTeams);
      const matchesInThisRound = remainingTeams / 2;
      currentDate.setDate(currentDate.getDate() + 1);
      timeIndex = 0;

      for (let m = 0; m < matchesInThisRound; m++) {
        const time = matchTimes[timeIndex % matchTimes.length];
        fixtures.push({
          event_id: config.eventId,
          round_name: roundName,
          match_number: matchNumber++,
          team_a_id: null, // Winner of previous match or Bye team
          team_b_id: null,
          team_a_name: `Winner of M${matchNumber - matchesInThisRound * 2}`,
          team_b_name: `Winner of M${matchNumber - matchesInThisRound * 2 + 1}`,
          venue_id: config.venueId,
          match_date: currentDate.toISOString().split('T')[0],
          start_time: time,
          status: 'scheduled',
          score_summary: 'TBD'
        });
        timeIndex++;
      }
      remainingTeams /= 2;
    }

    return {
      format: 'knockout',
      totalTeams: numTeams,
      bracketSize,
      byesAllocated: numByes,
      byeTeamNames: byeTeams.map(t => t.name),
      fixtures
    };
  }

  /**
   * Generates a Round-Robin / League schedule using the Berger / Polygon algorithm
   * Every team plays every other team once.
   */
  static generateLeague(teams, config) {
    if (!teams || teams.length < 2) {
      throw new Error('At least 2 approved teams are required to generate a league.');
    }

    const teamList = [...teams];
    const isOdd = teamList.length % 2 !== 0;
    if (isOdd) {
      teamList.push({ id: 'BYE', name: 'BYE (Rest Round)' });
    }

    const n = teamList.length;
    const totalRounds = n - 1;
    const matchesPerRound = n / 2;
    const fixtures = [];
    let matchNumber = 1;

    let currentDate = new Date(config.startDate || Date.now());
    const matchTimes = config.matchTimes || ['09:30', '14:00', '18:00'];
    let timeIndex = 0;

    for (let round = 0; round < totalRounds; round++) {
      currentDate.setDate(currentDate.getDate() + 1);
      timeIndex = 0;

      for (let i = 0; i < matchesPerRound; i++) {
        const team1 = teamList[i];
        const team2 = teamList[n - 1 - i];

        // Skip matches against the dummy BYE slot
        if (team1.id === 'BYE' || team2.id === 'BYE') {
          continue;
        }

        const time = matchTimes[timeIndex % matchTimes.length];

        fixtures.push({
          event_id: config.eventId,
          round_name: `Round ${round + 1}`,
          match_number: matchNumber++,
          team_a_id: team1.id,
          team_b_id: team2.id,
          team_a_name: team1.name,
          team_b_name: team2.name,
          venue_id: config.venueId,
          match_date: currentDate.toISOString().split('T')[0],
          start_time: time,
          status: 'scheduled',
          score_summary: 'Upcoming'
        });
        timeIndex++;
      }

      // Rotate teamList (keep first element fixed)
      const fixed = teamList[0];
      const rest = teamList.slice(1);
      rest.unshift(rest.pop());
      teamList.splice(0, teamList.length, fixed, ...rest);
    }

    return {
      format: 'league',
      totalTeams: teams.length,
      totalRounds,
      totalMatches: fixtures.length,
      fixtures
    };
  }

  /**
   * Conflict Detection Engine
   * Validates that no two matches overlap at the same venue on the same date/time,
   * and that no team is scheduled for two matches at the exact same time.
   */
  static detectConflicts(fixtures) {
    const conflicts = [];
    const venueSchedule = {}; // key: venueId_date_time -> fixture
    const teamSchedule = {};  // key: teamId_date_time -> fixture

    fixtures.forEach((f, idx) => {
      if (!f.match_date || !f.start_time) return;

      // 1. Check Venue Overlap
      if (f.venue_id) {
        const venueKey = `${f.venue_id}_${f.match_date}_${f.start_time}`;
        if (venueSchedule[venueKey]) {
          conflicts.push({
            type: 'VENUE_COLLISION',
            severity: 'HIGH',
            message: `Ground Conflict: Match #${f.match_number} overlaps with Match #${venueSchedule[venueKey].match_number} at the same venue on ${f.match_date} at ${f.start_time}.`,
            fixtureA: venueSchedule[venueKey],
            fixtureB: f
          });
        } else {
          venueSchedule[venueKey] = f;
        }
      }

      // 2. Check Team Double-Booking
      const checkTeam = (teamId, teamName) => {
        if (!teamId || teamId === 'BYE') return;
        const teamKey = `${teamId}_${f.match_date}_${f.start_time}`;
        if (teamSchedule[teamKey]) {
          conflicts.push({
            type: 'TEAM_DOUBLE_BOOKED',
            severity: 'CRITICAL',
            message: `Team Conflict: "${teamName}" is scheduled to play both Match #${teamSchedule[teamKey].match_number} and Match #${f.match_number} on ${f.match_date} at ${f.start_time}.`,
            fixtureA: teamSchedule[teamKey],
            fixtureB: f
          });
        } else {
          teamSchedule[teamKey] = f;
        }
      };

      checkTeam(f.team_a_id, f.team_a_name);
      checkTeam(f.team_b_id, f.team_b_name);
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflictCount: conflicts.length,
      conflicts
    };
  }
}
