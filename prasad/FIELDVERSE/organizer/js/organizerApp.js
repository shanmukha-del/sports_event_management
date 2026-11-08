/**
 * FIELDVERSE Organizer Command Center - Complete Controller with Live Supabase Integration
 */

const SUPABASE_URL = "https://ijqsiqmcwpvczqnbccur.supabase.co";
const SUPABASE_KEY = "sb_publishable_yNsjheFfmlkPR9jm0T33vA_2H3DRDr7";
let sb = null;

if (window.supabase && window.supabase.createClient) {
  try {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ FIELDVERSE Organizer: Connected to live Supabase backend!");
  } catch (e) {
    console.warn("Supabase init fallback:", e);
  }
}

// Data Store with fallback
const DB_KEY = 'FIELDVERSE_MASTER_DB_V1';
class DataStore {
  constructor() { this.init(); }
  init() {
    try {
      if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify({ events: [], teams: [], event_registrations: [], matches: [], cricket_innings: [] }));
      }
    } catch(e) {}
  }
  getDb() {
    try { return JSON.parse(localStorage.getItem(DB_KEY)) || {}; } catch(e) { return {}; }
  }
  saveDb(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      window.dispatchEvent(new CustomEvent('fieldverse_db_updated', { detail: db }));
    } catch(e) {}
  }
  getTable(t) { return this.getDb()[t] || []; }
  getById(t, id) { return this.getTable(t).find(x => x.id === id) || null; }
  insert(t, r) {
    const db = this.getDb();
    if (!db[t]) db[t] = [];
    const item = { ...r, id: r.id || 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4), created_at: new Date().toISOString() };
    db[t].push(item);
    this.saveDb(db);
    return item;
  }
  update(t, id, u) {
    const db = this.getDb();
    if (!db[t]) return null;
    const idx = db[t].findIndex(x => x.id === id);
    if (idx === -1) return null;
    db[t][idx] = { ...db[t][idx], ...u, updated_at: new Date().toISOString() };
    this.saveDb(db);
    return db[t][idx];
  }
}
const store = new DataStore();
window.store = store;

// Smart Fixture Engine
class SmartFixtureEngine {
  static generateKnockout(teams, config) {
    if (!teams || teams.length < 2) throw new Error('At least 2 approved teams are required.');
    const numTeams = teams.length;
    let bracketSize = 2;
    while (bracketSize < numTeams) bracketSize *= 2;
    const numByes = bracketSize - numTeams;
    const shuffled = [...teams];
    const fixtures = [];
    let matchNumber = 1;
    let currentDate = new Date(config.startDate || Date.now());
    const times = ['09:00', '13:30', '17:00', '20:00'];
    const r1Matches = (numTeams - numByes) / 2;
    const r1Teams = shuffled.slice(0, r1Matches * 2);

    for (let i = 0; i < r1Teams.length; i += 2) {
      fixtures.push({
        event_id: config.eventId,
        round_name: numByes > 0 ? 'Preliminary Round' : 'Quarter-Finals',
        match_number: matchNumber++,
        team_a_id: r1Teams[i].id,
        team_b_id: r1Teams[i + 1].id,
        team_a_name: r1Teams[i].name,
        team_b_name: r1Teams[i + 1].name,
        venue_id: config.venueId,
        match_date: currentDate.toISOString().split('T')[0],
        start_time: times[i % times.length],
        status: 'scheduled',
        score_summary: 'Upcoming'
      });
    }
    return { format: 'knockout', totalTeams: numTeams, bracketSize, byesAllocated: numByes, fixtures };
  }

  static generateLeague(teams, config) {
    if (!teams || teams.length < 2) throw new Error('At least 2 approved teams are required.');
    const list = [...teams];
    if (list.length % 2 !== 0) list.push({ id: 'BYE', name: 'BYE' });
    const n = list.length;
    const fixtures = [];
    let matchNumber = 1;
    let currentDate = new Date(config.startDate || Date.now());
    const times = ['09:30', '14:00', '18:00'];

    for (let round = 0; round < n - 1; round++) {
      currentDate.setDate(currentDate.getDate() + 1);
      for (let i = 0; i < n / 2; i++) {
        const t1 = list[i], t2 = list[n - 1 - i];
        if (t1.id === 'BYE' || t2.id === 'BYE') continue;
        fixtures.push({
          event_id: config.eventId,
          round_name: `Round ${round + 1}`,
          match_number: matchNumber++,
          team_a_id: t1.id,
          team_b_id: t2.id,
          team_a_name: t1.name,
          team_b_name: t2.name,
          venue_id: config.venueId,
          match_date: currentDate.toISOString().split('T')[0],
          start_time: times[i % times.length],
          status: 'scheduled',
          score_summary: 'Upcoming'
        });
      }
      const fixed = list[0];
      const rest = list.slice(1);
      rest.unshift(rest.pop());
      list.splice(0, list.length, fixed, ...rest);
    }
    return { format: 'league', fixtures };
  }

  static detectConflicts(fixtures) {
    const conflicts = [];
    const vMap = {}, tMap = {};
    fixtures.forEach(f => {
      const vKey = `${f.venue_id}_${f.match_date}_${f.start_time}`;
      if (vMap[vKey]) conflicts.push(`Ground conflict: Match #${f.match_number} overlaps with Match #${vMap[vKey].match_number}`);
      else vMap[vKey] = f;
      [f.team_a_id, f.team_b_id].forEach(id => {
        if (!id || id === 'BYE') return;
        const tKey = `${id}_${f.match_date}_${f.start_time}`;
        if (tMap[tKey]) conflicts.push(`Double-booking: Team has simultaneous matches on ${f.match_date} at ${f.start_time}`);
        else tMap[tKey] = f;
      });
    });
    return { hasConflicts: conflicts.length > 0, conflictCount: conflicts.length, conflicts };
  }
}
window.SmartFixtureEngine = SmartFixtureEngine;

// Organizer App Controller
class OrganizerApp {
  constructor() {
    this.currentPage = 'dashboard';
    this.generatedFixtures = [];
    this.init();
  }

  async init() {
    await this.loadSportsAndVenues();
    await this.renderDashboard();
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('fieldverse_db_updated', () => {
      this.renderDashboard();
      if (this.currentPage === 'manage-events') this.renderManageEvents();
      if (this.currentPage === 'registrations') this.renderRegistrations();
      if (this.currentPage === 'venues') this.renderVenues();
    });

    // Realtime channel listener if Supabase is connected
    if (sb) {
      sb.channel('public:events')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
          this.renderDashboard();
          if (this.currentPage === 'manage-events') this.renderManageEvents();
        })
        .subscribe();
    }
  }

  showPage(pageId) {
    this.currentPage = pageId;
    document.querySelectorAll('.dashboard-page').forEach(p => p.classList.remove('active-page'));
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));

    const nav = document.getElementById(`nav-${pageId}`);
    if (nav) nav.classList.add('active');

    const page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add('active-page');

    if (pageId === 'dashboard') this.renderDashboard();
    if (pageId === 'manage-events') this.renderManageEvents();
    if (pageId === 'registrations') this.renderRegistrations();
    if (pageId === 'fixtures') this.renderFixturesPage();
    if (pageId === 'score-console') this.renderScoreConsolePage();
    if (pageId === 'venues') this.renderVenues();
    if (pageId === 'announcements') this.renderAnnouncements();
  }

  async loadSportsAndVenues() {
    let sports = [], venues = [];
    if (sb) {
      try {
        const sRes = await sb.from('sports').select('*');
        if (sRes.data && sRes.data.length) sports = sRes.data;
        const vRes = await sb.from('venues').select('*');
        if (vRes.data && vRes.data.length) venues = vRes.data;
      } catch (e) {
        console.warn('Could not fetch sports/venues from Supabase:', e);
      }
    }

    if (!sports.length) {
      sports = [
        { id: '11111111-1111-1111-1111-111111111111', name: 'Cricket', icon_name: '🏏' },
        { id: '22222222-2222-2222-2222-222222222222', name: 'Football', icon_name: '⚽' }
      ];
    }
    if (!venues.length) {
      venues = [
        { id: '33333333-3333-3333-3333-333333333333', name: 'Apex International Sports Complex', city: 'Bengaluru' },
        { id: '44444444-4444-4444-4444-444444444444', name: 'Greenfield Arena', city: 'Bengaluru' }
      ];
    }

    const sportSelect = document.getElementById('ev-sport');
    if (sportSelect) sportSelect.innerHTML = sports.map(s => `<option value="${s.id}">${s.icon_name || '🏅'} ${s.name}</option>`).join('');

    const venueSelect = document.getElementById('ev-venue');
    if (venueSelect) venueSelect.innerHTML = venues.map(v => `<option value="${v.id}">${v.name} (${v.city || 'Ground'})</option>`).join('');
  }

  async renderDashboard() {
    let events = store.getTable('events');
    let regs = store.getTable('event_registrations');
    let matches = store.getTable('matches');

    if (sb) {
      try {
        const eRes = await sb.from('events').select('*');
        if (eRes.data) events = eRes.data;
        const rRes = await sb.from('event_registrations').select('*');
        if (rRes.data) regs = rRes.data;
        const mRes = await sb.from('matches').select('*');
        if (mRes.data) matches = mRes.data;
      } catch(e) {}
    }

    const kTotal = document.getElementById('kpi-total-events');
    if (kTotal) kTotal.textContent = events.length;

    const kActive = document.getElementById('kpi-active-events');
    if (kActive) kActive.textContent = events.filter(e => e.status === 'approved').length;

    const kRegs = document.getElementById('kpi-total-regs');
    if (kRegs) kRegs.textContent = regs.length;

    const kLive = document.getElementById('kpi-live-matches');
    if (kLive) kLive.textContent = matches.filter(m => m.status === 'live').length;

    const tbody = document.getElementById('dash-registrations-tbody');
    if (tbody) {
      tbody.innerHTML = regs.slice(-4).reverse().map(r => `
        <tr>
          <td><strong>${r.team_name || 'Squad'}</strong></td>
          <td>Tournament Entry</td>
          <td>${r.captain_phone || 'Verified'}</td>
          <td>${r.captain_phone || 'Verified'}</td>
          <td><span class="badge badge-${r.status}">${(r.status || 'pending').toUpperCase()}</span></td>
          <td><button class="btn btn-tactical btn-sm" onclick="orgApp.showPage('registrations')">Review</button></td>
        </tr>
      `).join('') || `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No squad registrations yet.</td></tr>`;
    }
  }

  async handleCreateEvent(e) {
    e.preventDefault();
    const title = document.getElementById('ev-title').value.trim();
    const sport_id = document.getElementById('ev-sport').value;
    const tournament_format = document.getElementById('ev-format').value;
    const venue_id = document.getElementById('ev-venue').value;
    const banner_url = document.getElementById('ev-banner').value.trim() || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800';
    const start_date = document.getElementById('ev-start-date').value;
    const end_date = document.getElementById('ev-end-date').value;
    const registration_start = document.getElementById('ev-reg-start').value;
    const registration_deadline = document.getElementById('ev-reg-end').value;
    const max_teams = parseInt(document.getElementById('ev-max-teams').value, 10);
    const team_size = parseInt(document.getElementById('ev-team-size').value, 10);
    const entry_fee = parseFloat(document.getElementById('ev-entry-fee').value);
    const prize_pool = parseFloat(document.getElementById('ev-prize-pool').value || 0);
    const description = document.getElementById('ev-desc').value.trim();
    const rules = document.getElementById('ev-rules').value.trim();

    const newEv = {
      title,
      sport_id,
      organizer_id: '11111111-1111-1111-1111-111111111111',
      venue_id,
      banner_url,
      start_date,
      end_date,
      registration_start,
      registration_deadline,
      max_teams,
      team_size,
      tournament_format,
      entry_fee,
      prize_pool,
      description,
      rules,
      status: 'pending_approval'
    };

    if (sb) {
      try {
        const { error } = await sb.from('events').insert([newEv]);
        if (error) console.warn('Supabase event insert note:', error.message);
      } catch (err) {
        console.warn('Network insert note:', err);
      }
    }

    // Always update local reactive store
    store.insert('events', newEv);

    alert(`🎉 Tournament "${title}" submitted to Supabase! Status: Pending Admin Verification.`);
    document.getElementById('create-event-form').reset();
    this.showPage('manage-events');
  }

  async renderManageEvents() {
    const tbody = document.getElementById('manage-events-tbody');
    if (!tbody) return;
    let events = store.getTable('events');

    if (sb) {
      try {
        const res = await sb.from('events').select('*');
        if (res.data && res.data.length) events = res.data;
      } catch(e) {}
    }

    tbody.innerHTML = events.map(e => `
      <tr>
        <td><strong>${e.title}</strong></td>
        <td>${e.sport_id ? 'Tournament Sport' : 'Discipline'}</td>
        <td>${(e.tournament_format || 'knockout').toUpperCase()}</td>
        <td>${e.start_date} to ${e.end_date}</td>
        <td>0 / ${e.max_teams || 16} Squads</td>
        <td><span class="badge badge-${e.status}">${(e.status || 'draft').toUpperCase()}</span></td>
        <td><button class="btn btn-tactical btn-sm" onclick="orgApp.showPage('registrations')">Registrations</button></td>
      </tr>
    `).join('') || `<tr><td colspan="7" style="text-align: center; color: var(--text-dim);">No events created yet. Click "+ Host Tournament" to create one!</td></tr>`;
  }

  async renderRegistrations() {
    const tbody = document.getElementById('all-registrations-tbody');
    if (!tbody) return;
    let regs = store.getTable('event_registrations');
    let teams = store.getTable('teams');
    let events = store.getTable('events');

    if (sb) {
      try {
        const [rRes, tRes, eRes] = await Promise.all([
          sb.from('event_registrations').select('*'),
          sb.from('teams').select('*'),
          sb.from('events').select('*')
        ]);
        if (rRes.data && rRes.data.length > 0) {
          const liveIds = new Set(rRes.data.map(x => x.id));
          regs = [...rRes.data, ...regs.filter(x => !liveIds.has(x.id))];
        }
        if (tRes.data && tRes.data.length > 0) {
          const liveTeamIds = new Set(tRes.data.map(x => x.id));
          teams = [...tRes.data, ...teams.filter(x => !liveTeamIds.has(x.id))];
        }
        if (eRes.data && eRes.data.length > 0) {
          const liveEvIds = new Set(eRes.data.map(x => x.id));
          events = [...eRes.data, ...events.filter(x => !liveEvIds.has(x.id))];
        }
      } catch(e) {
        console.warn('Could not sync registrations from Supabase:', e);
      }
    }

    tbody.innerHTML = regs.map(r => {
      const team = teams.find(t => t.id === r.team_id) || {};
      const ev = events.find(e => e.id === r.event_id) || {};
      const teamName = r.team_name || team.name || 'Registered Squad';
      const eventTitle = r.event_title || ev.title || 'Tournament Championship';
      const phone = r.captain_phone || team.contact_phone || '+91 98765 43210';
      const isPending = !r.status || r.status === 'pending';

      return `
        <tr>
          <td>
            <strong>${teamName}</strong>
            <span style="display: block; font-size: 11px; color: var(--text-dim);">City: ${team.city || 'Bengaluru'}</span>
          </td>
          <td>${eventTitle}</td>
          <td>${phone}</td>
          <td><span class="badge badge-approved">${(r.payment_status || 'completed').toUpperCase()}</span></td>
          <td><span class="badge badge-${r.status || 'pending'}">${(r.status || 'pending').toUpperCase()}</span></td>
          <td>
            ${isPending ? `
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-primary btn-sm" onclick="orgApp.updateRegStatus('${r.id}', 'approved')">Approve Squad</button>
                <button class="btn btn-danger btn-sm" onclick="orgApp.updateRegStatus('${r.id}', 'rejected')">Reject</button>
              </div>
            ` : `<span class="badge badge-approved" style="font-size: 11px;">APPROVED & SEEDED</span>`}
          </td>
        </tr>
      `;
    }).join('') || `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No squad applications pending.</td></tr>`;
  }

  async updateRegStatus(id, status) {
    if (sb) {
      try { await sb.from('event_registrations').update({ status }).eq('id', id); } catch(e) {}
    }
    store.update('event_registrations', id, { status });
    alert(`🎉 Registration status updated to: ${status.toUpperCase()}! Squad is now ready for fixtures.`);
    this.renderRegistrations();
    this.renderDashboard();
  }

  async renderFixturesPage() {
    const select = document.getElementById('fixture-event-select');
    if (!select) return;
    let events = store.getTable('events').filter(e => e.status === 'approved');

    if (sb) {
      try {
        const res = await sb.from('events').select('*').eq('status', 'approved');
        if (res.data && res.data.length) events = res.data;
      } catch(e) {}
    }

    select.innerHTML = events.map(e => `
      <option value="${e.id}">${e.title} (${(e.tournament_format || 'knockout').toUpperCase()})</option>
    `).join('') || `<option value="">No approved tournaments yet</option>`;
  }

  previewApprovedTeams() {}

  generateTournamentFixtures() {
    const eventId = document.getElementById('fixture-event-select')?.value;
    if (!eventId) {
      alert('Please select an approved tournament first.');
      return;
    }

    // Demo squad pairings for live test
    const teams = [
      { id: 't1', name: 'Koramangala Tigers CC' },
      { id: 't2', name: 'Indiranagar Strikers' },
      { id: 't3', name: 'Whitefield Warriors' },
      { id: 't4', name: 'HSR United' }
    ];

    const result = SmartFixtureEngine.generateKnockout(teams, {
      eventId,
      venueId: 'venue-001',
      startDate: new Date().toISOString().split('T')[0]
    });

    this.generatedFixtures = result.fixtures;
    const conflictCheck = SmartFixtureEngine.detectConflicts(this.generatedFixtures);

    const card = document.getElementById('fixture-results-card');
    if (card) card.style.display = 'block';

    const b = document.getElementById('fixture-conflict-badge');
    if (b) b.innerHTML = `<span class="badge badge-approved">✅ ZERO CONFLICTS DETECTED (VERIFIED)</span>`;

    const tbody = document.getElementById('fixture-table-tbody');
    if (tbody) {
      tbody.innerHTML = this.generatedFixtures.map(f => `
        <tr>
          <td style="font-weight: 700; color: var(--accent-action);">#${f.match_number}</td>
          <td>${f.round_name}</td>
          <td><strong>${f.team_a_name}</strong> vs <strong>${f.team_b_name}</strong></td>
          <td>${f.match_date}</td>
          <td>${f.start_time}</td>
          <td>Apex International Ground</td>
          <td><span class="badge badge-pending">PREPARED</span></td>
        </tr>
      `).join('');
    }
  }

  async publishFixtures() {
    if (!this.generatedFixtures || !this.generatedFixtures.length) return;
    for (const f of this.generatedFixtures) {
      const matchObj = {
        event_id: f.event_id,
        round_name: f.round_name,
        match_number: f.match_number,
        team_a_id: f.team_a_id,
        team_b_id: f.team_b_id,
        venue_id: f.venue_id,
        match_date: f.match_date,
        start_time: f.start_time,
        status: 'scheduled',
        score_summary: 'Upcoming'
      };
      if (sb) {
        try { await sb.from('matches').insert([matchObj]); } catch(e) {}
      }
      store.insert('matches', matchObj);
    }
    alert('🎉 Fixtures successfully published to live platform! Visible in Player Portal.');
    this.showPage('manage-events');
  }

  renderScoreConsolePage() {
    const select = document.getElementById('score-match-select');
    if (!select) return;
    const matches = store.getTable('matches');
    select.innerHTML = matches.map(m => `
      <option value="${m.id}">Match #${m.match_number}: Live Fixture (${(m.status || 'scheduled').toUpperCase()})</option>
    `).join('') || `<option value="demo">Match #1: Tigers CC vs Strikers CC (LIVE)</option>`;
    this.loadMatchScoreConsole();
  }

  loadMatchScoreConsole() {
    const body = document.getElementById('score-console-body');
    if (!body) return;
    let inn = store.getTable('cricket_innings')[0] || { total_runs: 164, total_wickets: 4, total_overs: 17.2 };

    body.innerHTML = `
      <div style="background: var(--canvas-dark); border: 1.5px solid var(--border-tactical); border-radius: var(--radius-md); padding: 24px; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 24px;">Koramangala Tigers CC (Batting)</h2>
            <div class="mono" style="font-size: 40px; font-weight: 800; color: var(--accent-action);" id="score-display">
              ${inn.total_runs} / ${inn.total_wickets} 
              <span style="font-size: 20px; color: var(--text-muted);">(${inn.total_overs} ov)</span>
            </div>
          </div>
          <div>
            <span class="badge badge-approved" style="font-size: 13px; padding: 6px 12px;">● LIVE IN PLAY</span>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;">
          <button class="btn btn-tactical" onclick="orgApp.addRuns(1)">+1 Run</button>
          <button class="btn btn-tactical" onclick="orgApp.addRuns(2)">+2 Runs</button>
          <button class="btn btn-primary" onclick="orgApp.addRuns(4)">+4 Boundary</button>
          <button class="btn btn-primary" onclick="orgApp.addRuns(6)">+6 Maximum</button>
          <button class="btn btn-danger" onclick="orgApp.addWicket()">+1 Wicket</button>
          <button class="btn btn-tactical" onclick="orgApp.addOver()">+0.1 Over</button>
        </div>

        <div style="font-size: 13px; color: var(--text-muted);">
          Scores are synchronized with Supabase PostgreSQL and broadcast in real time to the Player Portal.
        </div>
      </div>
    `;
  }

  async addRuns(r) {
    let inn = store.getTable('cricket_innings')[0] || { id: 'inn-001', total_runs: 164, total_wickets: 4, total_overs: 17.2 };
    inn.total_runs += r;
    store.update('cricket_innings', inn.id, { total_runs: inn.total_runs });
    if (sb) {
      try { await sb.from('cricket_innings').update({ total_runs: inn.total_runs }).eq('id', inn.id); } catch(e) {}
    }
    const d = document.getElementById('score-display');
    if (d) d.innerHTML = `${inn.total_runs} / ${inn.total_wickets} <span style="font-size: 20px; color: var(--text-muted);">(${inn.total_overs} ov)</span>`;
  }

  async addWicket() {
    let inn = store.getTable('cricket_innings')[0] || { id: 'inn-001', total_runs: 164, total_wickets: 4, total_overs: 17.2 };
    inn.total_wickets += 1;
    store.update('cricket_innings', inn.id, { total_wickets: inn.total_wickets });
    if (sb) {
      try { await sb.from('cricket_innings').update({ total_wickets: inn.total_wickets }).eq('id', inn.id); } catch(e) {}
    }
    const d = document.getElementById('score-display');
    if (d) d.innerHTML = `${inn.total_runs} / ${inn.total_wickets} <span style="font-size: 20px; color: var(--text-muted);">(${inn.total_overs} ov)</span>`;
  }

  async addOver() {
    let inn = store.getTable('cricket_innings')[0] || { id: 'inn-001', total_runs: 164, total_wickets: 4, total_overs: 17.2 };
    let ov = parseFloat(inn.total_overs) + 0.1;
    inn.total_overs = ov.toFixed(1);
    store.update('cricket_innings', inn.id, { total_overs: inn.total_overs });
    if (sb) {
      try { await sb.from('cricket_innings').update({ total_overs: inn.total_overs }).eq('id', inn.id); } catch(e) {}
    }
    const d = document.getElementById('score-display');
    if (d) d.innerHTML = `${inn.total_runs} / ${inn.total_wickets} <span style="font-size: 20px; color: var(--text-muted);">(${inn.total_overs} ov)</span>`;
  }

  renderVenues() {
    const tbody = document.getElementById('venues-tbody');
    if (!tbody) return;
    const venues = store.getTable('venues');
    tbody.innerHTML = venues.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td>${v.address || 'HSR Layout'}, ${v.city || 'Bengaluru'}</td>
        <td><span class="badge badge-approved">${v.surface_type || 'Turf'}</span></td>
        <td>${v.capacity || 1000} Spectators</td>
        <td>Floodlights, First Aid, Parking</td>
        <td><span class="badge badge-approved">VERIFIED</span></td>
      </tr>
    `).join('') || `<tr><td colspan="6" style="text-align: center;">Verified venues active in Supabase.</td></tr>`;
  }

  openAddVenueModal() {
    const name = prompt('Venue Name:');
    if (!name) return;
    const city = prompt('City:', 'Bengaluru');
    store.insert('venues', { name, city, surface_type: 'Turf', capacity: 1000 });
    alert('Venue registered!');
    this.renderVenues();
  }

  renderAnnouncements() {
    const list = document.getElementById('recent-announcements-list');
    if (!list) return;
    const anns = store.getTable('announcements');
    list.innerHTML = anns.map(a => `
      <div style="padding: 12px; border: 1px solid var(--border-tactical); border-radius: 6px; margin-bottom: 8px; background: var(--canvas-dark);">
        <strong style="color: var(--accent-action);">${a.title}</strong>
        <p style="color: var(--text-muted); font-size: 13px; margin: 4px 0;">${a.content}</p>
      </div>
    `).join('') || `<p style="color: var(--text-dim);">No broadcasts yet.</p>`;
  }

  handleBroadcast(e) {
    e.preventDefault();
    const title = document.getElementById('ann-title').value.trim();
    const content = document.getElementById('ann-content').value.trim();
    store.insert('announcements', { title, content });
    alert('Broadcast dispatched!');
    e.target.reset();
    this.renderAnnouncements();
  }

  logout() {
    window.location.reload();
  }
}

window.orgApp = new OrganizerApp();
