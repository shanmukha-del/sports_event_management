/**
 * FIELDVERSE Unified Relational Data Store
 * Provides persistent storage and synchronous reactivity across all three portals.
 * Automatically synchronizes with Supabase when credentials are provided.
 */

const DB_KEY = 'FIELDVERSE_MASTER_DB_V1';

const INITIAL_DATA = {
  profiles: [
    {
      id: 'admin-001',
      email: 'admin@fieldverse.com',
      full_name: 'Vikramaditya Rao',
      phone: '+91 98450 11223',
      role: 'admin',
      organizer_status: 'approved',
      organization_name: 'FIELDVERSE Operations',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Executive Commissioner at FIELDVERSE.',
      created_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'org-001',
      email: 'organizer@cricketclub.com',
      full_name: 'Sunil Gavaskar Sports Academy',
      phone: '+91 98200 55443',
      role: 'organizer',
      organizer_status: 'approved',
      organization_name: 'Apex Sports Management',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Official organizer of prime corporate and community sports championships.',
      created_at: '2026-01-10T00:00:00Z'
    },
    {
      id: 'org-002',
      email: 'pending.organizer@turf.com',
      full_name: 'Metro Football League Inc',
      phone: '+91 97110 99887',
      role: 'organizer',
      organizer_status: 'pending',
      organization_name: 'Metro Turf Arena Co.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      bio: 'Grassroots football tournament coordinators.',
      created_at: '2026-02-01T00:00:00Z'
    },
    {
      id: 'player-001',
      email: 'player@fieldverse.com',
      full_name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      role: 'player',
      organizer_status: 'approved',
      organization_name: null,
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      bio: 'Top-order aggressive batsman & medium pacer. Captain of Tigers CC.',
      created_at: '2026-02-10T00:00:00Z'
    }
  ],
  sports: [
    {
      id: 'sport-cricket',
      name: 'Cricket',
      slug: 'cricket',
      description: '20-over & 10-over outdoor leather/tennis ball cricket championships.',
      min_team_size: 11,
      max_team_size: 16,
      icon_name: '🏏',
      rules_json: { overs: 20, powerplay: 6, balls_per_over: 6 },
      is_active: true
    },
    {
      id: 'sport-football',
      name: 'Football',
      slug: 'football',
      description: '7v7 and 11v11 association football turf tournaments.',
      min_team_size: 7,
      max_team_size: 15,
      icon_name: '⚽',
      rules_json: { half_time_mins: 35, max_substitutes: 5 },
      is_active: true
    }
  ],
  venues: [
    {
      id: 'venue-001',
      name: 'Apex International Turf & Ground',
      address: 'Sector 4, HSR Outer Ring Road',
      city: 'Bengaluru',
      ground_details: 'Natural turf pitch with 68m boundary rope, floodlights & dressing rooms.',
      surface_type: 'Natural Turf',
      capacity: 1200,
      amenities: ['Floodlights', 'Changing Rooms', 'Live Digital Scoreboard', 'First Aid Station'],
      is_active: true
    },
    {
      id: 'venue-002',
      name: 'Greenfield Arena',
      address: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      ground_details: 'FIFA-approved artificial turf with shock pads and night floodlights.',
      surface_type: 'Artificial Turf',
      capacity: 600,
      amenities: ['Floodlights', 'Hydration Benches', 'Shower Rooms', 'Parking'],
      is_active: true
    },
    {
      id: 'venue-003',
      name: 'Skylight Sports Complex',
      address: 'Whitefield Main Road, Near ITPL',
      city: 'Bengaluru',
      ground_details: 'Multi-sport pavilion with turf ground and grandstand seating.',
      surface_type: 'Hybrid Turf',
      capacity: 1000,
      amenities: ['Floodlights', 'Cafeteria', 'VIP Lounge', 'Medical Staff'],
      is_active: true
    }
  ],
  events: [
    {
      id: 'event-001',
      title: 'Grand Monsoon Cricket Championship 2026',
      sport_id: 'sport-cricket',
      organizer_id: 'org-001',
      description: 'The premier open T20 cricket tournament of the year. Featuring 16 top verified clubs competing under floodlights.',
      banner_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
      venue_id: 'venue-001',
      start_date: '2026-11-20',
      end_date: '2026-11-28',
      registration_start: '2026-10-01',
      registration_deadline: '2026-11-18',
      max_teams: 16,
      team_size: 11,
      tournament_format: 'knockout',
      entry_fee: 2500,
      prize_pool: 75000,
      rules: 'Standard T20 ICC rules. White ball, colored clothing. Spikes permitted.',
      status: 'approved',
      rejection_reason: null,
      created_at: '2026-10-01T10:00:00Z'
    },
    {
      id: 'event-002',
      title: 'Bangalore Open 7v7 Football Trophy',
      sport_id: 'sport-football',
      organizer_id: 'org-001',
      description: 'High-octane 7-a-side football championship on premium FIFA turf. Fast paced, knockout matches.',
      banner_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
      venue_id: 'venue-002',
      start_date: '2026-11-25',
      end_date: '2026-11-30',
      registration_start: '2026-10-15',
      registration_deadline: '2026-11-22',
      max_teams: 8,
      team_size: 7,
      tournament_format: 'league',
      entry_fee: 3000,
      prize_pool: 50000,
      rules: '7 players on field + 3 rolling substitutes. 25-minute halves.',
      status: 'approved',
      rejection_reason: null,
      created_at: '2026-10-15T12:00:00Z'
    },
    {
      id: 'event-003',
      title: 'Corporate Night Cricket Cup',
      sport_id: 'sport-cricket',
      organizer_id: 'org-001',
      description: 'Exclusive 10-over floodlight knockout tournament for corporate tech teams.',
      banner_url: 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=800',
      venue_id: 'venue-003',
      start_date: '2026-12-05',
      end_date: '2026-12-07',
      registration_start: '2026-11-01',
      registration_deadline: '2026-11-30',
      max_teams: 12,
      team_size: 11,
      tournament_format: 'knockout',
      entry_fee: 4000,
      prize_pool: 100000,
      rules: '10 overs per side. Tennis hard ball. Strict corporate identity check.',
      status: 'pending_approval',
      rejection_reason: null,
      created_at: '2026-11-02T14:00:00Z'
    }
  ],
  teams: [
    {
      id: 'team-001',
      name: 'Koramangala Tigers CC',
      logo_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100',
      captain_id: 'player-001',
      contact_phone: '+91 98765 43210',
      contact_email: 'tigers.cc@gmail.com',
      city: 'Bengaluru'
    },
    {
      id: 'team-002',
      name: 'Indiranagar Strikers',
      logo_url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100',
      captain_id: 'player-001',
      contact_phone: '+91 98765 11111',
      contact_email: 'strikers@sports.org',
      city: 'Bengaluru'
    },
    {
      id: 'team-003',
      name: 'Whitefield Warriors',
      logo_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100',
      captain_id: 'player-001',
      contact_phone: '+91 98765 22222',
      contact_email: 'warriors@cricket.in',
      city: 'Bengaluru'
    },
    {
      id: 'team-004',
      name: 'HSR United FC',
      logo_url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100',
      captain_id: 'player-001',
      contact_phone: '+91 98765 33333',
      contact_email: 'hsr.fc@sports.in',
      city: 'Bengaluru'
    }
  ],
  team_members: [
    { id: 'tm-001', team_id: 'team-001', player_id: 'player-001', player_name: 'Rahul Sharma', jersey_number: 18, player_role: 'Captain / All-Rounder', is_captain: true },
    { id: 'tm-002', team_id: 'team-001', player_id: null, player_name: 'Vikram Seth', jersey_number: 7, player_role: 'Wicket Keeper', is_captain: false },
    { id: 'tm-003', team_id: 'team-001', player_id: null, player_name: 'Amitabh Roy', jersey_number: 24, player_role: 'Fast Bowler', is_captain: false },
    { id: 'tm-004', team_id: 'team-001', player_id: null, player_name: 'Devraj Patel', jersey_number: 99, player_role: 'Spin Bowler', is_captain: false },
    { id: 'tm-005', team_id: 'team-001', player_id: null, player_name: 'Karan Mehra', jersey_number: 11, player_role: 'Batsman', is_captain: false }
  ],
  event_registrations: [
    {
      id: 'reg-001',
      event_id: 'event-001',
      team_id: 'team-001',
      registered_by: 'player-001',
      status: 'approved',
      payment_status: 'completed',
      admin_notes: 'All documents verified. Roster confirmed.',
      created_at: '2026-10-05T12:00:00Z'
    },
    {
      id: 'reg-002',
      event_id: 'event-001',
      team_id: 'team-002',
      registered_by: 'player-001',
      status: 'approved',
      payment_status: 'completed',
      admin_notes: 'Fee paid.',
      created_at: '2026-10-06T14:00:00Z'
    },
    {
      id: 'reg-003',
      event_id: 'event-001',
      team_id: 'team-003',
      registered_by: 'player-001',
      status: 'approved',
      payment_status: 'completed',
      admin_notes: null,
      created_at: '2026-10-08T09:00:00Z'
    },
    {
      id: 'reg-004',
      event_id: 'event-002',
      team_id: 'team-004',
      registered_by: 'player-001',
      status: 'pending',
      payment_status: 'pending',
      admin_notes: 'Waiting for player roster approval.',
      created_at: '2026-10-20T16:00:00Z'
    }
  ],
  matches: [
    {
      id: 'match-001',
      event_id: 'event-001',
      round_name: 'Quarter-Final 1',
      match_number: 1,
      team_a_id: 'team-001',
      team_b_id: 'team-002',
      venue_id: 'venue-001',
      match_date: '2026-11-20',
      start_time: '18:00',
      status: 'live',
      winner_id: null,
      score_summary: 'Tigers 164/4 (17.2 ov) vs Strikers'
    },
    {
      id: 'match-002',
      event_id: 'event-001',
      round_name: 'Quarter-Final 2',
      match_number: 2,
      team_a_id: 'team-003',
      team_b_id: 'team-002',
      venue_id: 'venue-001',
      match_date: '2026-11-21',
      start_time: '18:00',
      status: 'scheduled',
      winner_id: null,
      score_summary: 'Upcoming'
    }
  ],
  cricket_innings: [
    {
      id: 'inn-001',
      match_id: 'match-001',
      team_id: 'team-001',
      innings_number: 1,
      total_runs: 164,
      total_wickets: 4,
      total_overs: 17.2,
      current_striker: 'Rahul Sharma (58* off 34)',
      current_non_striker: 'Devraj Patel (22 off 14)',
      current_bowler: 'A. Khan (3.2-0-28-2)',
      recent_overs_balls: ['1', '4', '0', 'W', '6', '1'],
      is_completed: false
    }
  ],
  football_match_events: [],
  announcements: [
    {
      id: 'ann-001',
      event_id: 'event-001',
      title: 'Toss Time & Reporting Schedule Confirmed',
      content: 'All teams participating in Quarter-Finals must report to Apex International Turf 45 minutes before toss time.',
      target_audience: 'players',
      created_by: 'org-001',
      created_at: '2026-11-15T10:00:00Z'
    },
    {
      id: 'ann-002',
      event_id: null,
      title: 'Welcome to FIELDVERSE Platform Release',
      content: 'We are thrilled to launch the unified tournament ecosystem for players, organizers, and sports enthusiasts.',
      target_audience: 'all',
      created_by: 'admin-001',
      created_at: '2026-11-01T08:00:00Z'
    }
  ],
  notifications: [
    {
      id: 'notif-001',
      user_id: 'player-001',
      title: 'Registration Approved!',
      message: 'Your team Koramangala Tigers CC was approved for Monsoon Cricket Championship.',
      link: '/pages/my-arena.html',
      type: 'success',
      is_read: false,
      created_at: '2026-10-06T15:00:00Z'
    },
    {
      id: 'notif-002',
      user_id: 'org-001',
      title: 'New Event Approval Request',
      message: 'Corporate Night Cricket Cup is submitted and awaiting admin verification.',
      link: '/pages/manage-events.html',
      type: 'info',
      is_read: false,
      created_at: '2026-11-02T14:05:00Z'
    }
  ],
  audit_logs: [
    {
      id: 'audit-001',
      user_id: 'admin-001',
      action: 'EVENT_APPROVED',
      entity_type: 'event',
      entity_id: 'event-001',
      details: { title: 'Grand Monsoon Cricket Championship 2026' },
      created_at: '2026-10-02T11:00:00Z'
    },
    {
      id: 'audit-002',
      user_id: 'admin-001',
      action: 'ORGANIZER_VERIFIED',
      entity_type: 'profile',
      entity_id: 'org-001',
      details: { name: 'Sunil Gavaskar Sports Academy' },
      created_at: '2026-01-11T12:00:00Z'
    }
  ]
};

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    }
  }

  getDb() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      this.init();
      return JSON.parse(localStorage.getItem(DB_KEY));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      this.init();
      return JSON.parse(localStorage.getItem(DB_KEY));
    }
  }

  saveDb(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('fieldverse_db_updated', { detail: db }));
  }

  // Generic Getters
  getTable(tableName) {
    const db = this.getDb();
    return db[tableName] || [];
  }

  getById(tableName, id) {
    const table = this.getTable(tableName);
    return table.find(item => item.id === id) || null;
  }

  // Insert Record
  insert(tableName, record) {
    const db = this.getDb();
    if (!db[tableName]) db[tableName] = [];
    const newRecord = {
      ...record,
      id: record.id || `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: record.created_at || new Date().toISOString()
    };
    db[tableName].push(newRecord);
    this.saveDb(db);
    return newRecord;
  }

  // Update Record
  update(tableName, id, updates) {
    const db = this.getDb();
    if (!db[tableName]) return null;
    const index = db[tableName].findIndex(item => item.id === id);
    if (index === -1) return null;
    db[tableName][index] = {
      ...db[tableName][index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveDb(db);
    return db[tableName][index];
  }

  // Delete Record
  delete(tableName, id) {
    const db = this.getDb();
    if (!db[tableName]) return false;
    const initialLen = db[tableName].length;
    db[tableName] = db[tableName].filter(item => item.id !== id);
    if (db[tableName].length !== initialLen) {
      this.saveDb(db);
      return true;
    }
    return false;
  }

  // Domain Queries: Events
  getPublishedEvents() {
    return this.getTable('events').filter(e => e.status === 'approved');
  }

  getOrganizerEvents(organizerId) {
    return this.getTable('events').filter(e => e.organizer_id === organizerId);
  }

  getPendingEvents() {
    return this.getTable('events').filter(e => e.status === 'pending_approval');
  }

  // Domain Queries: Registrations
  getEventRegistrations(eventId) {
    const regs = this.getTable('event_registrations').filter(r => r.event_id === eventId);
    const teams = this.getTable('teams');
    return regs.map(r => ({
      ...r,
      team: teams.find(t => t.id === r.team_id) || null
    }));
  }

  // Domain Queries: Matches & Telemetry
  getEventMatches(eventId) {
    const matches = this.getTable('matches').filter(m => m.event_id === eventId);
    const teams = this.getTable('teams');
    const venues = this.getTable('venues');
    return matches.map(m => ({
      ...m,
      team_a: teams.find(t => t.id === m.team_a_id) || null,
      team_b: teams.find(t => t.id === m.team_b_id) || null,
      venue: venues.find(v => v.id === m.venue_id) || null
    }));
  }

  getLiveMatches() {
    const matches = this.getTable('matches').filter(m => m.status === 'live');
    const teams = this.getTable('teams');
    const events = this.getTable('events');
    const venues = this.getTable('venues');
    return matches.map(m => ({
      ...m,
      team_a: teams.find(t => t.id === m.team_a_id) || null,
      team_b: teams.find(t => t.id === m.team_b_id) || null,
      event: events.find(e => e.id === m.event_id) || null,
      venue: venues.find(v => v.id === m.venue_id) || null
    }));
  }

  // Domain Queries: User Stats
  getPlayerArena(userId) {
    const teams = this.getTable('teams').filter(t => t.captain_id === userId);
    const teamIds = teams.map(t => t.id);
    const registrations = this.getTable('event_registrations')
      .filter(r => teamIds.includes(r.team_id) || r.registered_by === userId);
    const events = this.getTable('events');
    const matches = this.getTable('matches').filter(m => teamIds.includes(m.team_a_id) || teamIds.includes(m.team_b_id));
    
    return {
      teams,
      registrations: registrations.map(r => ({
        ...r,
        event: events.find(e => e.id === r.event_id) || null
      })),
      matches
    };
  }

  // Domain Queries: Admin KPI counts
  getAdminStats() {
    const profiles = this.getTable('profiles');
    const events = this.getTable('events');
    const teams = this.getTable('teams');
    const matches = this.getTable('matches');

    return {
      totalPlayers: profiles.filter(p => p.role === 'player').length,
      totalOrganizers: profiles.filter(p => p.role === 'organizer').length,
      pendingOrganizers: profiles.filter(p => p.role === 'organizer' && p.organizer_status === 'pending').length,
      totalEvents: events.length,
      pendingEvents: events.filter(e => e.status === 'pending_approval').length,
      approvedEvents: events.filter(e => e.status === 'approved').length,
      totalTeams: teams.length,
      completedMatches: matches.filter(m => m.status === 'completed').length,
      liveMatches: matches.filter(m => m.status === 'live').length
    };
  }
}

export const store = new DataStore();
