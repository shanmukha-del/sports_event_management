/**
 * FIELDVERSE Player Portal - Complete Self-Contained Controller
 * Compatible with both file:/// local execution and http/https server deployments.
 */

function generateUUID() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function toValidUUID(str, fallback) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (str && uuidRegex.test(str)) return str;
  return fallback;
}

// ============================================================================
// 1. DATA STORE
// ============================================================================
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
    }
  ],
  team_members: [],
  event_registrations: [
    {
      id: 'reg-001',
      event_id: 'event-001',
      team_id: 'team-001',
      registered_by: 'player-001',
      status: 'approved',
      payment_status: 'completed',
      admin_notes: 'All documents verified.',
      created_at: '2026-10-05T12:00:00Z'
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
  ]
};

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
      }
    } catch(e) {}
  }

  getDb() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) {
        this.init();
        return INITIAL_DATA;
      }
      return JSON.parse(raw);
    } catch (e) {
      return INITIAL_DATA;
    }
  }

  saveDb(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      window.dispatchEvent(new CustomEvent('fieldverse_db_updated', { detail: db }));
    } catch(e) {}
  }

  getTable(tableName) {
    const db = this.getDb();
    return db[tableName] || [];
  }

  getById(tableName, id) {
    const table = this.getTable(tableName);
    return table.find(item => item.id === id) || null;
  }

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

  getPublishedEvents() {
    return this.getTable('events').filter(e => e.status === 'approved');
  }

  getEventRegistrations(eventId) {
    const regs = this.getTable('event_registrations').filter(r => r.event_id === eventId);
    const teams = this.getTable('teams');
    return regs.map(r => ({
      ...r,
      team: teams.find(t => t.id === r.team_id) || null
    }));
  }

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
    const venues = this.getTable('venues');
    return matches.map(m => ({
      ...m,
      team_a: teams.find(t => t.id === m.team_a_id) || null,
      team_b: teams.find(t => t.id === m.team_b_id) || null,
      venue: venues.find(v => v.id === m.venue_id) || null
    }));
  }

  getPlayerArena(userId) {
    const teams = this.getTable('teams').filter(t => t.captain_id === userId);
    const teamIds = teams.map(t => t.id);
    const registrations = this.getTable('event_registrations').filter(r => teamIds.includes(r.team_id) || r.registered_by === userId);
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
}

const store = new DataStore();
window.store = store;

// ============================================================================
// 2. LIVE SUPABASE CLIENT & BRIDGE
// ============================================================================
const SUPABASE_URL = "https://ijqsiqmcwpvczqnbccur.supabase.co";
const SUPABASE_KEY = "sb_publishable_yNsjheFfmlkPR9jm0T33vA_2H3DRDr7";
let sb = null;

if (window.supabase && window.supabase.createClient) {
  try {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ FIELDVERSE Player: Connected to live Supabase backend!");
  } catch (e) {
    console.warn("Supabase init fallback:", e);
  }
}
window.sb = sb;

class SupabaseBridge {
  getCurrentProfile() {
    try {
      const raw = localStorage.getItem('FIELDVERSE_AUTH_SESSION');
      if (!raw) return store.getById('profiles', 'player-001'); // Auto-seed default player
      const session = JSON.parse(raw);
      return store.getById('profiles', session.user?.id) || session.profile || null;
    } catch(e) {
      return store.getById('profiles', 'player-001');
    }
  }

  async signInWithPassword(email, password) {
    if (sb) {
      try {
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          const profile = { id: data.user.id, email: data.user.email, full_name: data.user.user_metadata?.full_name || email.split('@')[0], role: 'player' };
          localStorage.setItem('FIELDVERSE_AUTH_SESSION', JSON.stringify({ user: data.user, profile }));
          return { data, error: null };
        }
      } catch (err) {
        console.warn('Supabase auth fallback:', err);
      }
    }
    const profile = store.getTable('profiles').find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!profile) return { error: { message: 'Invalid credentials.' } };
    localStorage.setItem('FIELDVERSE_AUTH_SESSION', JSON.stringify({ user: { id: profile.id, email: profile.email }, profile }));
    return { data: { user: { id: profile.id }, profile }, error: null };
  }

  async signUp(email, password, metadata = {}) {
    if (sb) {
      try {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { full_name: metadata.full_name || email.split('@')[0], role: 'player' } }
        });
        if (!error && data?.user) {
          const profile = { id: data.user.id, email: data.user.email, full_name: metadata.full_name, role: 'player', organizer_status: 'approved' };
          localStorage.setItem('FIELDVERSE_AUTH_SESSION', JSON.stringify({ user: data.user, profile }));
          return { data, error: null };
        }
      } catch (err) {
        console.warn('Supabase auth signup fallback:', err);
      }
    }
    const newProfile = store.insert('profiles', {
      email,
      full_name: metadata.full_name || email.split('@')[0],
      role: 'player',
      organizer_status: 'approved'
    });
    localStorage.setItem('FIELDVERSE_AUTH_SESSION', JSON.stringify({ user: { id: newProfile.id, email: newProfile.email }, profile: newProfile }));
    return { data: { user: { id: newProfile.id }, profile: newProfile }, error: null };
  }

  async signOut() {
    if (sb) {
      try { await sb.auth.signOut(); } catch(e) {}
    }
    localStorage.removeItem('FIELDVERSE_AUTH_SESSION');
    return { error: null };
  }
}

const authBridge = new SupabaseBridge();
window.authBridge = authBridge;

// ============================================================================
// 3. PLAYER APPLICATION CONTROLLER
// ============================================================================
class PlayerApp {
  constructor() {
    this.currentView = 'home';
    this.authMode = 'login';
    this.init();
  }

  async init() {
    await this.syncFromSupabase();
    this.checkSession();
    this.renderTicker();
    this.renderHome();
    this.renderDiscover();
    this.setupListeners();
  }

  async syncFromSupabase() {
    if (!sb) return;
    try {
      const [sportsRes, venuesRes, eventsRes, matchesRes, inningsRes] = await Promise.all([
        sb.from('sports').select('*'),
        sb.from('venues').select('*'),
        sb.from('events').select('*'),
        sb.from('matches').select('*'),
        sb.from('cricket_innings').select('*')
      ]);

      const db = store.getDb();
      if (sportsRes.data && sportsRes.data.length) db.sports = sportsRes.data;
      if (venuesRes.data && venuesRes.data.length) db.venues = venuesRes.data;
      if (eventsRes.data && eventsRes.data.length) db.events = eventsRes.data;
      if (matchesRes.data && matchesRes.data.length) db.matches = matchesRes.data;
      if (inningsRes.data && inningsRes.data.length) db.cricket_innings = inningsRes.data;

      store.saveDb(db);
      console.log('✅ Player Portal: Synced live Supabase tables.');
    } catch (e) {
      console.warn('Supabase sync note:', e);
    }
  }

  setupListeners() {
    window.addEventListener('fieldverse_db_updated', () => {
      this.renderTicker();
      this.renderHome();
      this.renderDiscover();
      if (this.currentView === 'arena') this.renderArena();
      if (this.currentView === 'live') this.renderLiveCenter();
      if (this.currentView === 'leaderboard') this.renderLeaderboard();
    });

    if (sb) {
      sb.channel('public:player-telemetry')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
          await this.syncFromSupabase();
          this.renderHome();
          this.renderDiscover();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, async () => {
          await this.syncFromSupabase();
          this.renderTicker();
          if (this.currentView === 'live') this.renderLiveCenter();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cricket_innings' }, async () => {
          await this.syncFromSupabase();
          this.renderTicker();
          if (this.currentView === 'live') this.renderLiveCenter();
        })
        .subscribe();
    }
  }

  checkSession() {
    const profile = authBridge.getCurrentProfile();
    const authBtns = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-profile-menu');
    const displayName = document.getElementById('user-display-name');

    if (profile) {
      if (authBtns) authBtns.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (displayName) displayName.textContent = profile.full_name || profile.email;
    } else {
      if (authBtns) authBtns.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  }

  showView(viewName, param = null) {
    this.currentView = viewName;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active-panel'));
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));

    const activeNav = document.getElementById(`nav-${viewName}`);
    if (activeNav) activeNav.classList.add('active');

    const panel = document.getElementById(`view-${viewName}`);
    if (panel) panel.classList.add('active-panel');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'discover') this.renderDiscover();
    if (viewName === 'event-details' && param) this.renderEventDetails(param);
    if (viewName === 'live') this.renderLiveCenter();
    if (viewName === 'leaderboard') this.renderLeaderboard();
    if (viewName === 'arena') this.renderArena();
    if (viewName === 'profile') this.renderProfile();
  }

  renderTicker() {
    const ticker = document.getElementById('ticker-content');
    if (!ticker) return;
    const liveMatches = store.getLiveMatches();

    if (!liveMatches || liveMatches.length === 0) {
      ticker.innerHTML = `<span>No matches in play right now. Upcoming fixtures scheduled today.</span>`;
      return;
    }

    ticker.innerHTML = liveMatches.map(m => `
      <div style="cursor: pointer;" onclick="app.showView('live')">
        🏏 <strong>${m.team_a?.name || 'Team A'}</strong> vs <strong>${m.team_b?.name || 'Team B'}</strong>
        • <span style="color: var(--primary);">${m.score_summary || 'Live'}</span>
      </div>
    `).join('');
  }

  renderHome() {
    const grid = document.getElementById('home-featured-grid');
    if (!grid) return;
    const events = store.getPublishedEvents().slice(0, 3);
    const sports = store.getTable('sports');
    const venues = store.getTable('venues');

    const metricEvents = document.getElementById('metric-events');
    if (metricEvents) metricEvents.textContent = store.getPublishedEvents().length;

    const metricVenues = document.getElementById('metric-venues');
    if (metricVenues) metricVenues.textContent = store.getTable('venues').length;

    const metricTeams = document.getElementById('metric-teams');
    if (metricTeams) metricTeams.textContent = store.getTable('teams').length;

    grid.innerHTML = events.map(e => {
      const sport = sports.find(s => s.id === e.sport_id);
      const venue = venues.find(v => v.id === e.venue_id);
      return this.createEventCardHtml(e, sport, venue);
    }).join('');
  }

  renderDiscover() {
    this.filterEvents();
  }

  filterEvents() {
    const searchVal = (document.getElementById('event-search')?.value || '').toLowerCase();
    const sportVal = document.getElementById('filter-sport')?.value || 'all';
    const formatVal = document.getElementById('filter-format')?.value || 'all';
    const feeVal = document.getElementById('filter-fee')?.value || 'all';

    let events = store.getPublishedEvents();
    const sports = store.getTable('sports');
    const venues = store.getTable('venues');

    events = events.filter(e => {
      const sport = sports.find(s => s.id === e.sport_id);
      const venue = venues.find(v => v.id === e.venue_id);

      const matchesSearch = !searchVal || 
        e.title.toLowerCase().includes(searchVal) ||
        (venue && venue.name.toLowerCase().includes(searchVal)) ||
        (venue && venue.city.toLowerCase().includes(searchVal));

      const matchesSport = sportVal === 'all' || (sport && sport.slug === sportVal);
      const matchesFormat = formatVal === 'all' || e.tournament_format === formatVal;
      const matchesFee = feeVal === 'all' || 
        (feeVal === 'free' && Number(e.entry_fee) === 0) ||
        (feeVal === 'paid' && Number(e.entry_fee) > 0);

      return matchesSearch && matchesSport && matchesFormat && matchesFee;
    });

    const grid = document.getElementById('discover-events-grid');
    if (!grid) return;
    if (events.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFF; border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 32px; margin-bottom: 12px;">🏟️</div>
          <h3>No Tournaments Found</h3>
          <p style="color: var(--text-muted); font-size: 14px; margin-top: 6px;">Try adjusting your search terms or filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = events.map(e => {
      const sport = sports.find(s => s.id === e.sport_id);
      const venue = venues.find(v => v.id === e.venue_id);
      return this.createEventCardHtml(e, sport, venue);
    }).join('');
  }

  createEventCardHtml(e, sport, venue) {
    const regs = store.getEventRegistrations(e.id);
    const feeText = Number(e.entry_fee) === 0 ? 'FREE' : `₹${e.entry_fee}`;
    const bgUrl = e.banner_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800';

    return `
      <div class="event-card">
        <div class="card-media" style="background-image: url('${bgUrl}');">
          <span class="badge badge-sport">${sport?.name || 'Sport'}</span>
          <span class="badge badge-fee">${feeText}</span>
        </div>
        <div class="card-body">
          <div class="card-date-strip">${e.start_date} • ${e.tournament_format.toUpperCase()}</div>
          <h3 class="card-title">${e.title}</h3>
          <div class="card-venue">📍 ${venue ? `${venue.name}, ${venue.city}` : 'Venue TBA'}</div>
          
          <div class="card-specs">
            <div class="spec-item">
              <span>Prize Pool</span>
              <strong>₹${Number(e.prize_pool).toLocaleString()}</strong>
            </div>
            <div class="spec-item">
              <span>Squad Size</span>
              <strong>${e.team_size} Players</strong>
            </div>
            <div class="spec-item">
              <span>Slots Filled</span>
              <strong>${regs.length} / ${e.max_teams}</strong>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-outline btn-sm" onclick="app.showView('event-details', '${e.id}')">View Details</button>
            <button class="btn btn-primary btn-sm" onclick="app.openRegistrationModal('${e.id}')">Register Squad →</button>
          </div>
        </div>
      </div>
    `;
  }

  renderEventDetails(eventId) {
    const e = store.getById('events', eventId);
    if (!e) return;

    const sport = store.getById('sports', e.sport_id);
    const venue = store.getById('venues', e.venue_id);
    const registrations = store.getEventRegistrations(e.id);
    const matches = store.getEventMatches(e.id);

    const container = document.getElementById('event-details-content');
    if (!container) return;
    container.innerHTML = `
      <div style="background: #FFF; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; box-shadow: var(--shadow-sm); margin-bottom: 32px;">
        <div style="height: 240px; background-image: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(48,60,50,0.85) 100%), url('${e.banner_url}'); background-size: cover; background-position: center; padding: 32px; display: flex; flex-direction: column; justify-content: flex-end; color: #FFF;">
          <h1 style="color: #FFF; font-size: 32px; margin-bottom: 6px;">${e.title}</h1>
          <div style="font-size: 14px; color: var(--warm-beige);">
            📅 ${e.start_date} to ${e.end_date} • 📍 ${venue?.name}, ${venue?.city}
          </div>
        </div>

        <div style="padding: 32px;">
          <h3 style="margin-bottom: 12px;">About the Tournament</h3>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">${e.description || 'No description provided.'}</p>

          <h3 style="margin-bottom: 12px;">Rules & Regulations</h3>
          <div style="background: var(--canvas-bg); padding: 16px; border-radius: var(--radius-md); font-size: 14px; margin-bottom: 24px;">
            ${e.rules || 'Standard tournament rules apply.'}
          </div>

          <button class="btn btn-primary btn-lg" onclick="app.openRegistrationModal('${e.id}')">
            Register Your Squad for ₹${e.entry_fee} →
          </button>
        </div>
      </div>
    `;
  }

  renderLiveCenter() {
    const container = document.getElementById('live-matches-container');
    if (!container) return;
    const liveMatches = store.getLiveMatches();

    if (liveMatches.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: #FFF; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 36px; margin-bottom: 12px;">⏱️</div>
          <h3>No Matches Currently Live</h3>
          <p style="color: var(--text-muted); font-size: 14px; margin-top: 6px;">Check back during match hours or view upcoming fixtures in My Arena.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = liveMatches.map(m => {
      const innings = store.getTable('cricket_innings').find(i => i.match_id === m.id);
      return `
        <div style="background: #FFF; border-radius: var(--radius-lg); border: 2px solid var(--live-emerald); padding: 28px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div class="ticker-pulse-tag">
              <div class="pulse-dot"></div> MATCH IN PLAY
            </div>
            <span style="font-size: 13px; color: var(--text-muted);">${m.round_name}</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <h2 style="font-size: 26px;">${m.team_a?.name}</h2>
              <div class="mono" style="font-size: 34px; font-weight: 800; color: var(--primary);">
                ${innings ? `${innings.total_runs}/${innings.total_wickets}` : '0/0'} 
                <span style="font-size: 18px; color: var(--text-muted);">(${innings ? innings.total_overs : 0} ov)</span>
              </div>
            </div>
            <div style="font-size: 20px; font-weight: 800; color: var(--text-light);">VS</div>
            <div style="text-align: right;">
              <h2 style="font-size: 26px;">${m.team_b?.name || 'Opponent'}</h2>
              <div style="font-size: 14px; color: var(--text-muted);">Yet to bat</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderLeaderboard() {
    const select = document.getElementById('leaderboard-event-select');
    if (!select) return;
    const events = store.getPublishedEvents();

    if (select.children.length === 0) {
      select.innerHTML = events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
    }

    const eventId = select.value || (events[0] ? events[0].id : null);
    const tbody = document.getElementById('leaderboard-table-body');
    if (!tbody) return;

    if (!eventId) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No active tournaments available.</td></tr>`;
      return;
    }

    const registrations = store.getEventRegistrations(eventId).filter(r => r.status === 'approved');
    tbody.innerHTML = registrations.map((r, idx) => `
      <tr>
        <td style="font-weight: 700; color: var(--primary);">#${idx + 1}</td>
        <td><strong>${r.team?.name || 'Squad'}</strong></td>
        <td>3</td>
        <td>${idx === 0 ? 3 : 2}</td>
        <td>${idx === 0 ? 0 : 1}</td>
        <td>0</td>
        <td style="font-weight: 800;">${idx === 0 ? 6 : 4}</td>
        <td><span class="badge badge-approved">ACTIVE</span></td>
      </tr>
    `).join('') || `<tr><td colspan="8" style="text-align: center;">No teams on leaderboard yet.</td></tr>`;
  }

  renderArena() {
    const profile = authBridge.getCurrentProfile();
    const regTbody = document.getElementById('arena-registrations-table');
    const matchTbody = document.getElementById('arena-matches-table');

    if (!profile) {
      if (regTbody) regTbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Please sign in.</td></tr>`;
      return;
    }

    const arenaData = store.getPlayerArena(profile.id);

    if (regTbody) {
      regTbody.innerHTML = arenaData.registrations.length ? arenaData.registrations.map(r => `
        <tr>
          <td><strong>${r.event?.title || 'Tournament'}</strong></td>
          <td>${r.team_id}</td>
          <td>${r.event?.tournament_format?.toUpperCase() || 'KNOCKOUT'}</td>
          <td>${r.event?.start_date || 'TBA'}</td>
          <td><span class="badge badge-${r.status}">${r.status.toUpperCase()}</span></td>
          <td><span class="badge badge-approved">${r.payment_status.toUpperCase()}</span></td>
        </tr>
      `).join('') : `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No squads registered yet.</td></tr>`;
    }

    if (matchTbody) {
      matchTbody.innerHTML = arenaData.matches.length ? arenaData.matches.map(m => `
        <tr>
          <td>Match #${m.match_number}</td>
          <td><strong>Team A vs Team B</strong></td>
          <td>${m.round_name}</td>
          <td>Apex Ground A</td>
          <td>${m.match_date} at ${m.start_time}</td>
          <td><span class="badge badge-sport">${m.status.toUpperCase()}</span></td>
        </tr>
      `).join('') : `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No matches scheduled yet.</td></tr>`;
    }
  }

  renderProfile() {
    const profile = authBridge.getCurrentProfile();
    if (!profile) return;
    const nameInput = document.getElementById('profile-name');
    if (nameInput) nameInput.value = profile.full_name || '';
    const emailInput = document.getElementById('profile-email');
    if (emailInput) emailInput.value = profile.email || '';
    const phoneInput = document.getElementById('profile-phone');
    if (phoneInput) phoneInput.value = profile.phone || '';
    const bioInput = document.getElementById('profile-bio');
    if (bioInput) bioInput.value = profile.bio || '';
  }

  saveProfile() {
    const profile = authBridge.getCurrentProfile();
    if (!profile) return;

    store.update('profiles', profile.id, {
      full_name: document.getElementById('profile-name').value,
      phone: document.getElementById('profile-phone').value,
      bio: document.getElementById('profile-bio').value
    });
    alert('Profile updated successfully!');
    this.checkSession();
  }

  openRegistrationModal(preselectEventId = null) {
    const profile = authBridge.getCurrentProfile();
    if (!profile) {
      alert('Please sign in or create an account to register a squad.');
      this.openAuthModal('signup');
      return;
    }

    const select = document.getElementById('reg-event-select');
    const events = store.getPublishedEvents();
    if (select) {
      select.innerHTML = events.map(e => `
        <option value="${e.id}" ${preselectEventId === e.id ? 'selected' : ''}>
          ${e.title} (${e.tournament_format.toUpperCase()} • Fee: ₹${e.entry_fee})
        </option>
      `).join('');
    }

    const nameInput = document.getElementById('reg-captain-name');
    if (nameInput) nameInput.value = profile.full_name || '';
    const phoneInput = document.getElementById('reg-captain-phone');
    if (phoneInput) phoneInput.value = profile.phone || '';

    const modal = document.getElementById('modal-registration');
    if (modal) modal.classList.add('active-modal');
  }

  async handleRegistrationSubmit(e) {
    e.preventDefault();
    const profile = authBridge.getCurrentProfile();
    if (!profile) return;

    const eventId = document.getElementById('reg-event-select').value;
    const teamName = document.getElementById('reg-team-name').value.trim();
    const captainName = document.getElementById('reg-captain-name').value.trim();
    const captainPhone = document.getElementById('reg-captain-phone').value.trim();
    const roster = document.getElementById('reg-roster').value.trim();

    const teamUuid = generateUUID();
    const regUuid = generateUUID();
    const captainUuid = toValidUUID(profile.id, '22222222-2222-2222-2222-222222222222');
    const targetEventUuid = toValidUUID(eventId, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

    const newTeam = store.insert('teams', {
      id: teamUuid,
      name: teamName,
      captain_id: captainUuid,
      contact_phone: captainPhone,
      contact_email: profile.email || 'captain@fieldverse.com',
      city: 'Bengaluru'
    });

    const playerNames = roster.split(',').map(n => n.trim()).filter(Boolean);
    playerNames.forEach((name, idx) => {
      store.insert('team_members', {
        id: generateUUID(),
        team_id: teamUuid,
        player_name: name,
        jersey_number: idx + 1,
        is_captain: idx === 0
      });
    });

    const reg = store.insert('event_registrations', {
      id: regUuid,
      event_id: targetEventUuid,
      team_id: teamUuid,
      team_name: teamName,
      captain_phone: captainPhone,
      registered_by: captainUuid,
      status: 'pending',
      payment_status: 'completed',
      admin_notes: 'Online registration submitted.'
    });

    // Also attempt live Supabase insert with valid UUIDs
    if (sb) {
      try {
        const { error: tErr } = await sb.from('teams').insert([{
          id: teamUuid,
          name: teamName,
          captain_id: captainUuid,
          contact_phone: captainPhone,
          contact_email: profile.email || 'captain@fieldverse.com',
          city: 'Bengaluru'
        }]);
        if (tErr) console.warn('Supabase team insert note:', tErr.message);

        const { error: rErr } = await sb.from('event_registrations').insert([{
          id: regUuid,
          event_id: targetEventUuid,
          team_id: teamUuid,
          registered_by: captainUuid,
          status: 'pending',
          payment_status: 'completed'
        }]);
        if (rErr) console.warn('Supabase registration insert note:', rErr.message);
        else console.log('✅ Squad registered to live Supabase successfully!');
      } catch (err) {
        console.warn('Supabase registration insert note:', err);
      }
    }

    this.closeModal('modal-registration');
    alert(`🎉 Squad "${teamName}" registered successfully! Awaiting organizer approval.`);
    this.showView('arena');
  }

  openAuthModal(mode = 'login') {
    this.authMode = mode;
    this.updateAuthModalView();
    const modal = document.getElementById('modal-auth');
    if (modal) modal.classList.add('active-modal');
  }

  toggleAuthMode() {
    this.authMode = this.authMode === 'login' ? 'signup' : 'login';
    this.updateAuthModalView();
  }

  updateAuthModalView() {
    const isSignup = this.authMode === 'signup';
    const title = document.getElementById('auth-modal-title');
    if (title) title.textContent = isSignup ? 'Create Player Account' : 'Sign In to FIELDVERSE';
    const nameGroup = document.getElementById('auth-fullname-group');
    if (nameGroup) nameGroup.style.display = isSignup ? 'block' : 'none';
  }

  async handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const fullName = document.getElementById('auth-fullname').value.trim();

    if (this.authMode === 'signup') {
      await authBridge.signUp(email, password, { full_name: fullName, role: 'player' });
    } else {
      await authBridge.signInWithPassword(email, password);
    }

    this.closeModal('modal-auth');
    this.checkSession();
    this.showView('arena');
  }

  async logout() {
    await authBridge.signOut();
    this.checkSession();
    this.showView('home');
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active-modal');
  }
}

// Global initialization
window.app = new PlayerApp();
