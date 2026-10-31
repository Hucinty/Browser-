import { Bookmark, BrowserExtension, BrowserSettings, HistoryItem, LoginActivity, SavedLogin, Tab } from '../types/browser';

const KEYS = {
  TABS: 'nova_tabs_v1',
  ACTIVE_TAB_ID: 'nova_active_tab_id_v1',
  LOGINS: 'nova_saved_logins_v1',
  LOGIN_ACTIVITY: 'nova_login_activity_v1',
  BOOKMARKS: 'nova_bookmarks_v1',
  HISTORY: 'nova_history_v1',
  EXTENSIONS: 'nova_extensions_v1',
  SETTINGS: 'nova_settings_v1',
  INSTAGRAM_SESSION: 'nova_instagram_session_v1',
};

const DEFAULT_SETTINGS: BrowserSettings = {
  defaultSearchEngine: 'google',
  theme: 'dark',
  enableAdBlock: true,
  enableDarkReader: false,
  savePasswordsPrompt: true,
  backgroundAudioEnabled: true,
  zoomLevel: 1.0,
  hardwareAcceleration: true,
  doNotTrack: true,
  homePageUrl: 'nova://start',
};

const DEFAULT_EXTENSIONS: BrowserExtension[] = [
  {
    id: 'adblock-nova',
    name: 'AdBlock Nova Shield',
    description: 'Blocks intrusive trackers, popups, and banner ads automatically.',
    version: '3.4.1',
    icon: 'Shield',
    enabled: true,
    badge: '18 blocked',
    author: 'Nova Security Lab',
  },
  {
    id: 'dark-reader',
    name: 'Dark Reader Pro',
    description: 'Invert high-contrast bright backgrounds for comfortable nighttime browsing.',
    version: '2.1.0',
    icon: 'Moon',
    enabled: false,
    author: 'Alexander V.',
  },
  {
    id: 'password-vault',
    name: 'Nova Password Guardian',
    description: 'Zero-knowledge password vault and auto-fill login assistant.',
    version: '4.0.8',
    icon: 'Key',
    enabled: true,
    badge: 'Active',
    author: 'Nova Core',
  },
  {
    id: 'reader-view',
    name: 'Clean Speed Reader',
    description: 'Strips web clutter into distraction-free typographic reading format.',
    version: '1.2.5',
    icon: 'BookOpen',
    enabled: true,
    author: 'Typography Guild',
  },
  {
    id: 'music-stream',
    name: 'Background Audio Engine',
    description: 'Plays music and chillout radio non-stop even when switching tabs or device locks.',
    version: '5.2.0',
    icon: 'Music',
    enabled: true,
    badge: 'Live',
    author: 'Nova Soundworks',
  },
];

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: 'bm-1', title: 'Instagram', url: 'https://instagram.com', category: 'Social', createdAt: Date.now() - 86400000 * 5 },
  { id: 'bm-2', title: 'Web Games Hub', url: 'nova://games', category: 'Entertainment', createdAt: Date.now() - 86400000 * 4 },
  { id: 'bm-3', title: 'Lo-Fi Radio & Music', url: 'nova://music', category: 'Audio', createdAt: Date.now() - 86400000 * 3 },
  { id: 'bm-4', title: 'Passwords & Vault', url: 'nova://passwords', category: 'Tools', createdAt: Date.now() - 86400000 * 2 },
  { id: 'bm-5', title: 'Developer Console', url: 'nova://devtools', category: 'Developer', createdAt: Date.now() - 86400000 * 1 },
];

const DEFAULT_LOGINS: SavedLogin[] = [
  {
    id: 'login-insta-demo',
    website: 'Instagram',
    domain: 'instagram.com',
    username: 'alex.photographr',
    password: 'NovaSecurePass2026!',
    displayName: 'Alex Rivers',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivers',
    createdAt: Date.now() - 86400000 * 7,
    lastUsedAt: Date.now() - 1000 * 60 * 35,
    useCount: 14,
    category: 'social',
  },
  {
    id: 'login-spotify-demo',
    website: 'Spotify Web',
    domain: 'spotify.com',
    username: 'alex.rivers@nova.net',
    password: 'AudioBeatStream99$',
    displayName: 'Alex R.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpotifyAlex',
    createdAt: Date.now() - 86400000 * 12,
    lastUsedAt: Date.now() - 1000 * 60 * 120,
    useCount: 8,
    category: 'entertainment',
  },
  {
    id: 'login-github-demo',
    website: 'GitHub',
    domain: 'github.com',
    username: 'alex-developer',
    password: 'GitCommitPush2026#',
    displayName: 'Alex Developer',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=alexdev',
    createdAt: Date.now() - 86400000 * 20,
    lastUsedAt: Date.now() - 1000 * 60 * 300,
    useCount: 29,
    category: 'work',
  },
];

const DEFAULT_ACTIVITY: LoginActivity[] = [
  {
    id: 'act-1',
    website: 'instagram.com',
    username: 'alex.photographr',
    timestamp: Date.now() - 1000 * 60 * 35,
    ipAddress: '192.168.1.104 (Session Verified)',
    userAgent: 'NovaBrowser/2026.1 (X11; Linux x86_64)',
    status: 'success',
  },
  {
    id: 'act-2',
    website: 'spotify.com',
    username: 'alex.rivers@nova.net',
    timestamp: Date.now() - 1000 * 60 * 120,
    ipAddress: '192.168.1.104 (Session Verified)',
    userAgent: 'NovaBrowser/2026.1 (X11; Linux x86_64)',
    status: 'success',
  },
  {
    id: 'act-3',
    website: 'github.com',
    username: 'alex-developer',
    timestamp: Date.now() - 1000 * 60 * 300,
    ipAddress: '192.168.1.104 (Session Verified)',
    userAgent: 'NovaBrowser/2026.1 (X11; Linux x86_64)',
    status: 'refreshed',
  },
];

export const storageService = {
  // Tabs
  getTabs(): Tab[] {
    try {
      const stored = localStorage.getItem(KEYS.TABS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse tabs from localStorage', e);
    }
    return [
      {
        id: 'tab-start',
        title: 'New Tab',
        url: 'nova://start',
        favicon: 'Globe',
        history: ['nova://start'],
        historyIndex: 0,
        isLoading: false,
        isMuted: false,
        isPinned: false,
        isIncognito: false,
      },
      {
        id: 'tab-insta',
        title: 'Instagram',
        url: 'https://instagram.com',
        favicon: 'Instagram',
        history: ['https://instagram.com'],
        historyIndex: 0,
        isLoading: false,
        isMuted: false,
        isPinned: false,
        isIncognito: false,
      },
      {
        id: 'tab-games',
        title: 'Web Games Hub',
        url: 'nova://games',
        favicon: 'Gamepad2',
        history: ['nova://games'],
        historyIndex: 0,
        isLoading: false,
        isMuted: false,
        isPinned: false,
        isIncognito: false,
      },
    ];
  },

  saveTabs(tabs: Tab[]) {
    try {
      localStorage.setItem(KEYS.TABS, JSON.stringify(tabs));
    } catch (e) {
      console.error(e);
    }
  },

  getActiveTabId(): string {
    return localStorage.getItem(KEYS.ACTIVE_TAB_ID) || 'tab-start';
  },

  saveActiveTabId(id: string) {
    localStorage.setItem(KEYS.ACTIVE_TAB_ID, id);
  },

  // Saved Logins (Vault)
  getLogins(): SavedLogin[] {
    try {
      const stored = localStorage.getItem(KEYS.LOGINS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse logins', e);
    }
    return DEFAULT_LOGINS;
  },

  saveLogins(logins: SavedLogin[]) {
    try {
      localStorage.setItem(KEYS.LOGINS, JSON.stringify(logins));
    } catch (e) {
      console.error(e);
    }
  },

  saveOrUpdateLogin(newLogin: Omit<SavedLogin, 'id' | 'createdAt' | 'lastUsedAt' | 'useCount'>): SavedLogin {
    const logins = this.getLogins();
    const existingIndex = logins.findIndex(
      (l) => l.domain.toLowerCase() === newLogin.domain.toLowerCase() && l.username.toLowerCase() === newLogin.username.toLowerCase()
    );

    let savedItem: SavedLogin;
    if (existingIndex >= 0) {
      savedItem = {
        ...logins[existingIndex],
        ...newLogin,
        password: newLogin.password,
        lastUsedAt: Date.now(),
        useCount: (logins[existingIndex].useCount || 1) + 1,
      };
      logins[existingIndex] = savedItem;
    } else {
      savedItem = {
        id: 'login-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        ...newLogin,
        createdAt: Date.now(),
        lastUsedAt: Date.now(),
        useCount: 1,
      };
      logins.unshift(savedItem);
    }

    this.saveLogins(logins);

    // Record login activity
    this.addLoginActivity({
      website: newLogin.domain,
      username: newLogin.username,
      status: 'success',
    });

    return savedItem;
  },

  deleteLogin(id: string) {
    const logins = this.getLogins().filter((l) => l.id !== id);
    this.saveLogins(logins);
  },

  // Login Activity Log
  getLoginActivity(): LoginActivity[] {
    try {
      const stored = localStorage.getItem(KEYS.LOGIN_ACTIVITY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse login activity', e);
    }
    return DEFAULT_ACTIVITY;
  },

  addLoginActivity(item: { website: string; username: string; status: 'success' | 'refreshed' | 'failed' }) {
    const list = this.getLoginActivity();
    const newEntry: LoginActivity = {
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      website: item.website,
      username: item.username,
      timestamp: Date.now(),
      ipAddress: '127.0.0.1 (Local Session)',
      userAgent: 'NovaBrowser/2026.1 (Modern Web Kit)',
      status: item.status,
    };
    list.unshift(newEntry);
    // Keep max 50 items
    try {
      localStorage.setItem(KEYS.LOGIN_ACTIVITY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.error(e);
    }
  },

  clearLoginActivity() {
    try {
      localStorage.setItem(KEYS.LOGIN_ACTIVITY, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  },

  // Instagram active session simulation
  getInstagramSession(): { isLoggedIn: boolean; username: string; displayName: string; avatarUrl: string } {
    try {
      const stored = localStorage.getItem(KEYS.INSTAGRAM_SESSION);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    // Check if we have instagram saved login
    const saved = this.getLogins().find((l) => l.domain.includes('instagram.com'));
    if (saved) {
      return {
        isLoggedIn: true,
        username: saved.username,
        displayName: saved.displayName || saved.username,
        avatarUrl: saved.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + saved.username,
      };
    }
    return {
      isLoggedIn: false,
      username: '',
      displayName: '',
      avatarUrl: '',
    };
  },

  setInstagramSession(session: { isLoggedIn: boolean; username: string; displayName: string; avatarUrl: string }) {
    try {
      localStorage.setItem(KEYS.INSTAGRAM_SESSION, JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
  },

  // Bookmarks
  getBookmarks(): Bookmark[] {
    try {
      const stored = localStorage.getItem(KEYS.BOOKMARKS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_BOOKMARKS;
  },

  saveBookmarks(bookmarks: Bookmark[]) {
    try {
      localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  },

  addBookmark(item: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const bookmarks = this.getBookmarks();
    const newBm: Bookmark = {
      id: 'bm-' + Date.now(),
      ...item,
      createdAt: Date.now(),
    };
    bookmarks.push(newBm);
    this.saveBookmarks(bookmarks);
    return newBm;
  },

  removeBookmark(url: string) {
    const bookmarks = this.getBookmarks().filter((b) => b.url !== url);
    this.saveBookmarks(bookmarks);
  },

  // History
  getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(KEYS.HISTORY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return [
      { id: 'h-1', title: 'Instagram - Feed & Reels', url: 'https://instagram.com', visitedAt: Date.now() - 1000 * 60 * 20 },
      { id: 'h-2', title: 'Web Games Hub: 2048 & Retro Snake', url: 'nova://games', visitedAt: Date.now() - 1000 * 60 * 60 },
      { id: 'h-3', title: 'Nova Chillout Lo-Fi Music', url: 'nova://music', visitedAt: Date.now() - 1000 * 60 * 120 },
    ];
  },

  addHistory(title: string, url: string, favicon?: string) {
    const history = this.getHistory();
    // Do not log internal chrome start pages repeatedly
    if (url === 'nova://start') return;
    history.unshift({
      id: 'h-' + Date.now(),
      title,
      url,
      visitedAt: Date.now(),
      favicon,
    });
    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  },

  clearHistory() {
    try {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }
  },

  // Extensions
  getExtensions(): BrowserExtension[] {
    try {
      const stored = localStorage.getItem(KEYS.EXTENSIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_EXTENSIONS;
  },

  saveExtensions(extensions: BrowserExtension[]) {
    try {
      localStorage.setItem(KEYS.EXTENSIONS, JSON.stringify(extensions));
    } catch (e) {
      console.error(e);
    }
  },

  // Settings
  getSettings(): BrowserSettings {
    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: BrowserSettings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },
};
