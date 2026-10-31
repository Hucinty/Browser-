export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  isMuted: boolean;
  isPinned: boolean;
  isIncognito: boolean;
  audioPlaying?: boolean;
}

export interface SavedLogin {
  id: string;
  website: string;
  domain: string;
  username: string;
  password: string; // stored securely in local vault
  displayName?: string;
  avatarUrl?: string;
  createdAt: number;
  lastUsedAt: number;
  useCount: number;
  category: 'social' | 'entertainment' | 'work' | 'finance' | 'other';
}

export interface LoginActivity {
  id: string;
  website: string;
  username: string;
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'refreshed' | 'failed';
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  category?: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt: number;
  favicon?: string;
}

export interface BrowserExtension {
  id: string;
  name: string;
  description: string;
  version: string;
  icon: string;
  enabled: boolean;
  badge?: string;
  author: string;
  isCustom?: boolean;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  coverArt: string;
  streamUrl?: string;
  synthBpm?: number;
  synthScale?: string;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  statusText: string;
  type: 'document' | 'xhr' | 'fetch' | 'script' | 'stylesheet' | 'image' | 'media';
  size: string;
  timeMs: number;
  timestamp: number;
}

export interface ConsoleLogMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  content: string;
  timestamp: number;
}

export type ViewportMode = 'desktop-full' | 'desktop-1440' | 'tablet-768' | 'mobile-390';

export interface BrowserSettings {
  defaultSearchEngine: 'google' | 'duckduckgo' | 'bing' | 'ecosia';
  theme: 'dark' | 'light' | 'midnight' | 'cyber';
  enableAdBlock: boolean;
  enableDarkReader: boolean;
  savePasswordsPrompt: boolean;
  backgroundAudioEnabled: boolean;
  zoomLevel: number; // 0.8 to 1.5
  hardwareAcceleration: boolean;
  doNotTrack: boolean;
  homePageUrl: string;
}
