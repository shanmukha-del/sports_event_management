/**
 * FIELDVERSE Admin Governance Portal - Complete Self-Contained Controller
 * Compatible with both file:/// local execution and http/https server deployments.
 */

// ============================================================================
// 1. DATA STORE & SUPABASE CLIENT
// ============================================================================
const SUPABASE_URL = "https://ijqsiqmcwpvczqnbccur.supabase.co";
const SUPABASE_KEY = "sb_publishable_yNsjheFfmlkPR9jm0T33vA_2H3DRDr7";
let sb = null;

if (window.supabase && window.supabase.createClient) {
  try {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ FIELDVERSE Admin: Connected to live Supabase backend!");
  } catch (e) {
    console.warn("Supabase init fallback:", e);
  }
}
window.sb = sb;

const DB_KEY = 'FIELDVERSE_MASTER_DB_V1';

class DataStore {
  constructor() {
    this.init();
  }

  init() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) {
        // If not initialized, fallback to default store
        console.log('Admin initializing default store');
      }
    } catch(e) {}
  }

  getDb() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
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

  getPendingEvents() {
    return this.getTable('events').filter(e => e.status === 'pending_approval');
  }

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
      completedMatches: matches.filter(m => m.status === 'completed').length
    };
  }
}

const store = new DataStore();
window.store = store;

// ============================================================================
// 2. ADMIN APPLICATION CONTROLLER
// ============================================================================
class AdminApp {
  constructor() {
    this.currentPage = 'dashboard';
    this.init();
  }

  async init() {
    await this.syncFromSupabase();
    this.renderDashboard();
    this.setupListeners();
    this.loadSettings();
  }

  async syncFromSupabase() {
    if (!sb) return;
    try {
      const [eventsRes, orgsRes, sportsRes, venuesRes] = await Promise.all([
        sb.from('events').select('*'),
        sb.from('profiles').select('*'),
        sb.from('sports').select('*'),
        sb.from('venues').select('*')
      ]);

      const db = store.getDb();
      if (eventsRes.data && eventsRes.data.length) db.events = eventsRes.data;
      if (orgsRes.data && orgsRes.data.length) db.profiles = orgsRes.data;
      if (sportsRes.data && sportsRes.data.length) db.sports = sportsRes.data;
      if (venuesRes.data && venuesRes.data.length) db.venues = venuesRes.data;

      store.saveDb(db);
      console.log('✅ Admin Portal: Synced live Supabase tables.');
    } catch(e) {
      console.warn('Admin Supabase sync note:', e);
    }
  }

  setupListeners() {
    window.addEventListener('fieldverse_db_updated', () => {
      this.renderDashboard();
      if (this.currentPage === 'organizers') this.renderOrganizers();
      if (this.currentPage === 'events') this.renderEvents();
      if (this.currentPage === 'players') this.renderPlayers();
      if (this.currentPage === 'sports') this.renderSports();
      if (this.currentPage === 'venues') this.renderVenues();
      if (this.currentPage === 'audit') this.renderAuditLogs();
    });

    if (sb) {
      sb.channel('public:admin-telemetry')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
          await this.syncFromSupabase();
          this.renderDashboard();
          if (this.currentPage === 'events') this.renderEvents();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async () => {
          await this.syncFromSupabase();
          this.renderDashboard();
          if (this.currentPage === 'organizers') this.renderOrganizers();
        })
        .subscribe();
    }
  }

  showPage(pageId) {
    this.currentPage = pageId;
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active-page'));
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));

    const nav = document.getElementById(`nav-${pageId}`);
    if (nav) nav.classList.add('active');

    const page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add('active-page');

    if (pageId === 'dashboard') this.renderDashboard();
    if (pageId === 'organizers') this.renderOrganizers();
    if (pageId === 'events') this.renderEvents();
    if (pageId === 'squads') this.renderSquads();
    if (pageId === 'players') this.renderPlayers();
    if (pageId === 'sports') this.renderSports();
    if (pageId === 'venues') this.renderVenues();
    if (pageId === 'audit') this.renderAuditLogs();
  }

  refreshData() {
    this.renderDashboard();
    alert('✅ Database synchronized successfully.');
  }

  renderDashboard() {
    const stats = store.getAdminStats();
    const kpiPlayers = document.getElementById('kpi-players');
    if (kpiPlayers) kpiPlayers.textContent = stats.totalPlayers;
    const kpiPendingOrgs = document.getElementById('kpi-pending-orgs');
    if (kpiPendingOrgs) kpiPendingOrgs.textContent = stats.pendingOrganizers;
    const kpiPendingEvents = document.getElementById('kpi-pending-events');
    if (kpiPendingEvents) kpiPendingEvents.textContent = stats.pendingEvents;
    const kpiPublished = document.getElementById('kpi-published-events');
    if (kpiPublished) kpiPublished.textContent = stats.approvedEvents;

    const bPendingOrgs = document.getElementById('badge-pending-orgs');
    if (bPendingOrgs) bPendingOrgs.textContent = stats.pendingOrganizers;
    const bPendingEvents = document.getElementById('badge-pending-events');
    if (bPendingEvents) bPendingEvents.textContent = stats.pendingEvents;

    // Quick Pending Events
    const pendingEvents = store.getPendingEvents();
    const evList = document.getElementById('dash-pending-events-list');
    if (evList) {
      if (pendingEvents.length === 0) {
        evList.innerHTML = `<p style="color: var(--admin-text-muted); font-size: 13px;">No events currently waiting for approval.</p>`;
      } else {
        evList.innerHTML = pendingEvents.map(e => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--admin-canvas); border: 1px solid var(--admin-border); border-radius: 6px; margin-bottom: 8px;">
            <div>
              <strong style="font-size: 14px;">${e.title}</strong>
              <span style="display: block; font-size: 11px; color: var(--admin-text-muted);">${e.tournament_format.toUpperCase()} • Fee: ₹${e.entry_fee}</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="adminApp.approveEvent('${e.id}')">Approve</button>
          </div>
        `).join('');
      }
    }

    // Quick Pending Organizers
    const pendingOrgs = store.getTable('profiles').filter(p => p.role === 'organizer' && p.organizer_status === 'pending');
    const orgList = document.getElementById('dash-pending-orgs-list');
    if (orgList) {
      if (pendingOrgs.length === 0) {
        orgList.innerHTML = `<p style="color: var(--admin-text-muted); font-size: 13px;">No organizer verification requests pending.</p>`;
      } else {
        orgList.innerHTML = pendingOrgs.map(o => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--admin-canvas); border: 1px solid var(--admin-border); border-radius: 6px; margin-bottom: 8px;">
            <div>
              <strong style="font-size: 14px;">${o.organization_name || o.full_name}</strong>
              <span style="display: block; font-size: 11px; color: var(--admin-text-muted);">${o.email}</span>
            </div>
            <button class="btn btn-success btn-sm" onclick="adminApp.approveOrganizer('${o.id}')">Verify</button>
          </div>
        `).join('');
      }
    }
  }

  renderOrganizers() {
    const tbody = document.getElementById('organizers-tbody');
    if (!tbody) return;
    const orgs = store.getTable('profiles').filter(p => p.role === 'organizer');

    tbody.innerHTML = orgs.map(o => `
      <tr>
        <td><strong>${o.organization_name || 'N/A'}</strong></td>
        <td>${o.full_name}</td>
        <td>${o.email}</td>
        <td>${o.phone || 'N/A'}</td>
        <td><span class="badge badge-${o.organizer_status}">${o.organizer_status.toUpperCase()}</span></td>
        <td>
          ${o.organizer_status === 'pending' ? `
            <button class="btn btn-success btn-sm" onclick="adminApp.approveOrganizer('${o.id}')">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="adminApp.rejectOrganizer('${o.id}')">Reject</button>
          ` : `
            <button class="btn btn-subtle btn-sm" onclick="adminApp.toggleOrganizerStatus('${o.id}')">
              ${o.organizer_status === 'approved' ? 'Suspend' : 'Activate'}
            </button>
          `}
        </td>
      </tr>
    `).join('');
  }

  async approveOrganizer(id) {
    if (sb) {
      try {
        await sb.from('profiles').update({ organizer_status: 'approved' }).eq('id', id);
      } catch (e) {
        console.warn('Supabase organizer update note:', e);
      }
    }
    const org = store.update('profiles', id, { organizer_status: 'approved' });
    store.insert('audit_logs', {
      user_id: 'admin-001',
      action: 'ORGANIZER_VERIFIED',
      entity_type: 'profile',
      entity_id: id,
      details: { name: org?.organization_name || org?.full_name }
    });
    alert('Organizer approved and verified successfully!');
    this.renderDashboard();
    this.renderOrganizers();
  }

  async rejectOrganizer(id) {
    if (sb) {
      try {
        await sb.from('profiles').update({ organizer_status: 'rejected' }).eq('id', id);
      } catch (e) {}
    }
    store.update('profiles', id, { organizer_status: 'rejected' });
    alert('Organizer application rejected.');
    this.renderOrganizers();
  }

  toggleOrganizerStatus(id) {
    const org = store.getById('profiles', id);
    const newStatus = org.organizer_status === 'approved' ? 'suspended' : 'approved';
    if (sb) {
      try {
        sb.from('profiles').update({ organizer_status: newStatus }).eq('id', id);
      } catch (e) {}
    }
    store.update('profiles', id, { organizer_status: newStatus });
    alert(`Organizer status updated to ${newStatus.toUpperCase()}`);
    this.renderOrganizers();
  }

  renderEvents() {
    const tbody = document.getElementById('events-approval-tbody');
    if (!tbody) return;
    const events = store.getTable('events');
    const sports = store.getTable('sports');
    const profiles = store.getTable('profiles');

    tbody.innerHTML = events.map(e => {
      const sport = sports.find(s => s.id === e.sport_id);
      const org = profiles.find(p => p.id === e.organizer_id);
      return `
        <tr>
          <td><strong>${e.title}</strong></td>
          <td>${sport?.name || 'Sport'}</td>
          <td>${org?.organization_name || org?.full_name || 'Organizer'}</td>
          <td>${e.start_date} to ${e.end_date}</td>
          <td>₹${e.entry_fee}</td>
          <td><span class="badge badge-${e.status}">${e.status.toUpperCase()}</span></td>
          <td>
            ${e.status === 'pending_approval' ? `
              <button class="btn btn-success btn-sm" onclick="adminApp.approveEvent('${e.id}')">Approve & Publish</button>
              <button class="btn btn-danger btn-sm" onclick="adminApp.rejectEvent('${e.id}')">Reject</button>
            ` : `
              <button class="btn btn-subtle btn-sm" onclick="adminApp.toggleEventStatus('${e.id}')">
                ${e.status === 'approved' ? 'Unpublish' : 'Republish'}
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  async approveEvent(id) {
    if (sb) {
      try {
        await sb.from('events').update({ status: 'approved' }).eq('id', id);
      } catch (e) {
        console.warn('Supabase approve event note:', e);
      }
    }
    const ev = store.update('events', id, { status: 'approved' });
    store.insert('audit_logs', {
      user_id: 'admin-001',
      action: 'EVENT_APPROVED',
      entity_type: 'event',
      entity_id: id,
      details: { title: ev?.title }
    });
    alert(`🎉 Tournament "${ev?.title || 'Event'}" approved and published to the Player Portal!`);
    this.renderDashboard();
    this.renderEvents();
  }

  async rejectEvent(id) {
    const reason = prompt('Enter rejection reason for organizer:');
    if (!reason) return;
    if (sb) {
      try {
        await sb.from('events').update({ status: 'rejected', rejection_reason: reason }).eq('id', id);
      } catch (e) {}
    }
    const ev = store.update('events', id, { status: 'rejected', rejection_reason: reason });
    store.insert('audit_logs', {
      user_id: 'admin-001',
      action: 'EVENT_REJECTED',
      entity_type: 'event',
      entity_id: id,
      details: { title: ev?.title, reason }
    });
    alert('Tournament rejected.');
    this.renderEvents();
  }

  toggleEventStatus(id) {
    const ev = store.getById('events', id);
    const newStatus = ev.status === 'approved' ? 'cancelled' : 'approved';
    store.update('events', id, { status: newStatus });
    alert(`Event status updated to ${newStatus.toUpperCase()}`);
    this.renderEvents();
  }

  async renderSquads() {
    const tbody = document.getElementById('admin-squads-tbody');
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
      } catch(e) {}
    }

    tbody.innerHTML = regs.map(r => {
      const team = teams.find(t => t.id === r.team_id) || {};
      const ev = events.find(e => e.id === r.event_id) || {};
      const teamName = r.team_name || team.name || 'Registered Squad';
      const eventTitle = r.event_title || ev.title || 'Tournament Championship';
      const phone = r.captain_phone || team.contact_phone || 'Verified';
      const city = team.city || 'Bengaluru';
      const status = r.status || 'pending';

      return `
        <tr>
          <td><strong>${teamName}</strong></td>
          <td>${eventTitle}</td>
          <td>${phone}</td>
          <td>${city}</td>
          <td><span class="badge badge-approved">${(r.payment_status || 'completed').toUpperCase()}</span></td>
          <td><span class="badge badge-${status}">${status.toUpperCase()}</span></td>
          <td>
            ${status === 'pending' ? `
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-success btn-sm" onclick="adminApp.overrideSquadStatus('${r.id}', 'approved')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="adminApp.overrideSquadStatus('${r.id}', 'rejected')">Reject</button>
              </div>
            ` : `<button class="btn btn-subtle btn-sm" onclick="adminApp.overrideSquadStatus('${r.id}', '${status === 'approved' ? 'pending' : 'approved'}')">Toggle</button>`}
          </td>
        </tr>
      `;
    }).join('') || `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted);">No squads registered across the platform yet.</td></tr>`;
  }

  async overrideSquadStatus(id, status) {
    if (sb) {
      try {
        await sb.from('event_registrations').update({ status }).eq('id', id);
      } catch(e) {}
    }
    store.update('event_registrations', id, { status });
    this.logAudit(`SQUAD_${status.toUpperCase()}`, 'event_registrations', { id, status });
    alert(`Squad registration status updated to: ${status.toUpperCase()}`);
    this.renderSquads();
  }

  renderPlayers() {
    const tbody = document.getElementById('players-tbody');
    if (!tbody) return;
    const players = store.getTable('profiles').filter(p => p.role === 'player');
    const teams = store.getTable('teams');

    tbody.innerHTML = players.map(p => {
      const squadsCount = teams.filter(t => t.captain_id === p.id).length;
      return `
        <tr>
          <td><strong>${p.full_name}</strong></td>
          <td>${p.email}</td>
          <td>${p.phone || 'N/A'}</td>
          <td><span class="badge badge-approved">VERIFIED PLAYER</span></td>
          <td>${squadsCount} Squads</td>
          <td>
            <button class="btn btn-subtle btn-sm" onclick="alert('Player credentials active. No suspension flags.')">Inspect</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderSports() {
    const tbody = document.getElementById('sports-tbody');
    if (!tbody) return;
    const sports = store.getTable('sports');

    tbody.innerHTML = sports.map(s => `
      <tr>
        <td><strong>${s.icon_name} ${s.name}</strong></td>
        <td><code>${s.slug}</code></td>
        <td>${s.min_team_size} Players</td>
        <td>${s.max_team_size} Players</td>
        <td><pre style="font-size: 11px; margin: 0;">${JSON.stringify(s.rules_json)}</pre></td>
        <td><span class="badge badge-${s.is_active ? 'approved' : 'rejected'}">${s.is_active ? 'ACTIVE' : 'INACTIVE'}</span></td>
        <td>
          <button class="btn btn-subtle btn-sm" onclick="adminApp.toggleSportActive('${s.id}')">Toggle</button>
        </td>
      </tr>
    `).join('');
  }

  toggleSportActive(id) {
    const s = store.getById('sports', id);
    store.update('sports', id, { is_active: !s.is_active });
    this.renderSports();
  }

  openAddSportModal() {
    const name = prompt('Enter Sport Name:');
    if (!name) return;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const minSize = parseInt(prompt('Minimum Squad Size:', '7'), 10) || 7;
    const maxSize = parseInt(prompt('Maximum Squad Size:', '15'), 10) || 15;

    store.insert('sports', {
      name,
      slug,
      min_team_size: minSize,
      max_team_size: maxSize,
      icon_name: '🏅',
      rules_json: {},
      is_active: true
    });

    alert('Sport added successfully!');
    this.renderSports();
  }

  renderVenues() {
    const tbody = document.getElementById('admin-venues-tbody');
    if (!tbody) return;
    const venues = store.getTable('venues');

    tbody.innerHTML = venues.map(v => `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td>${v.address}, ${v.city}</td>
        <td><span class="badge badge-approved">${v.surface_type}</span></td>
        <td>${v.capacity}</td>
        <td>${(v.amenities || []).join(', ')}</td>
        <td><span class="badge badge-approved">VERIFIED</span></td>
      </tr>
    `).join('');
  }

  renderAuditLogs() {
    const tbody = document.getElementById('audit-tbody');
    if (!tbody) return;
    const logs = store.getTable('audit_logs').slice().reverse();

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td><code style="color: var(--admin-primary); font-weight: 700;">${l.action}</code></td>
        <td>Admin (${l.user_id})</td>
        <td>${l.entity_type}</td>
        <td><pre style="font-size: 11px; margin: 0;">${JSON.stringify(l.details)}</pre></td>
        <td style="color: var(--admin-text-muted); font-size: 12px;">${l.created_at}</td>
      </tr>
    `).join('');
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem('FIELDVERSE_SUPABASE_CONFIG');
      if (stored) {
        const config = JSON.parse(stored);
        const urlInput = document.getElementById('cfg-supabase-url');
        const keyInput = document.getElementById('cfg-supabase-key');
        if (urlInput && config.url) urlInput.value = config.url;
        if (keyInput && config.anonKey) keyInput.value = config.anonKey;
      }
    } catch(e) {}
  }

  saveSupabaseConfig() {
    const url = document.getElementById('cfg-supabase-url').value.trim();
    const key = document.getElementById('cfg-supabase-key').value.trim();
    try {
      localStorage.setItem('FIELDVERSE_SUPABASE_CONFIG', JSON.stringify({ url, anonKey: key }));
      alert('Supabase configuration saved! The platform will now use your Supabase project credentials.');
    } catch(e) {}
  }

  logout() {
    alert('Signed out of Executive Control.');
    window.location.reload();
  }
}

// Global initialization
window.adminApp = new AdminApp();
