/**
 * FIELDVERSE Supabase Client Bridge
 * Seamlessly integrates with live Supabase Auth, PostgreSQL & Realtime.
 * Gracefully proxies to local reactive DataStore when external credentials are not set.
 */
import { store } from './dataStore.js';

class SupabaseBridge {
  constructor() {
    this.config = this.loadConfig();
    this.client = null;
    this.initLiveClient();
  }

  loadConfig() {
    const stored = localStorage.getItem('FIELDVERSE_SUPABASE_CONFIG');
    if (stored) {
      try { return JSON.parse(stored); } catch(e){}
    }
    return window.__FIELDVERSE_CONFIG__ || {
      url: '',
      anonKey: ''
    };
  }

  saveConfig(url, anonKey) {
    const config = { url, anonKey };
    localStorage.setItem('FIELDVERSE_SUPABASE_CONFIG', JSON.stringify(config));
    this.config = config;
    this.initLiveClient();
  }

  initLiveClient() {
    if (this.config.url && this.config.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.config.url, this.config.anonKey);
        console.log('✅ FIELDVERSE: Connected to live Supabase backend');
      } catch (err) {
        console.warn('⚠️ FIELDVERSE: Supabase init error, running on local store:', err);
      }
    }
  }

  isLive() {
    return !!this.client;
  }

  // Auth Operations
  async signUp(email, password, metadata = {}) {
    if (this.client) {
      return await this.client.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
    }

    // Local Store Fallback
    const existing = store.getTable('profiles').find(p => p.email === email);
    if (existing) {
      return { error: { message: 'User already registered with this email.' } };
    }

    const newProfile = store.insert('profiles', {
      email,
      full_name: metadata.full_name || email.split('@')[0],
      role: metadata.role || 'player',
      organizer_status: metadata.role === 'organizer' ? 'pending' : 'approved',
      organization_name: metadata.organization_name || null,
      phone: metadata.phone || null
    });

    const sessionUser = {
      id: newProfile.id,
      email: newProfile.email,
      user_metadata: metadata
    };

    localStorage.setItem('FIELDVERSE_AUTH_SESSION', JSON.stringify({
      user: sessionUser,
      profile: newProfile
    }));

    return { data: { user: sessionUser, profile: newProfile }, error: null };
  }

  async signInWithPassword(email, password) {
    if (this.client) {
      return await this.client.auth.signInWithPassword({ email, password });
    }

    // Local Store Fallback
    const profile = store.getTable('profiles').find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!profile) {
      return { error: { message: 'Invalid credentials. User not found.' } };
    }

    const sessionUser = { id: profile.id, email: profile.email };
    localStorage.setItem('FIELDVERSE_AUTH_SESSION', JSON.stringify({
      user: sessionUser,
      profile
    }));

    return { data: { user: sessionUser, profile }, error: null };
  }

  async signOut() {
    if (this.client) {
      await this.client.auth.signOut();
    }
    localStorage.removeItem('FIELDVERSE_AUTH_SESSION');
    return { error: null };
  }

  getCurrentSession() {
    const raw = localStorage.getItem('FIELDVERSE_AUTH_SESSION');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch(e) {
      return null;
    }
  }

  getCurrentUser() {
    const session = this.getCurrentSession();
    return session ? session.user : null;
  }

  getCurrentProfile() {
    const session = this.getCurrentSession();
    if (!session || !session.user) return null;
    // Always refresh profile from data store to get latest role/status
    const profile = store.getById('profiles', session.user.id);
    return profile || session.profile || null;
  }
}

export const supabase = new SupabaseBridge();
