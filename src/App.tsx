import React, { useState, useEffect, useCallback } from 'react';
import { TabBar } from './components/browser/TabBar';
import { AddressBar } from './components/browser/AddressBar';
import { BookmarksBar } from './components/browser/BookmarksBar';
import { ViewportFrame } from './components/browser/ViewportFrame';
import { FloatingPiP } from './components/browser/FloatingPiP';
import { BackgroundMusicWidget } from './components/browser/BackgroundMusicWidget';
import { DevTools } from './components/browser/DevTools';
import { PrintModal } from './components/browser/PrintModal';
import { SavePasswordPrompt } from './components/browser/SavePasswordPrompt';

import { StartPage } from './components/pages/StartPage';
import { InstagramApp } from './components/pages/InstagramApp';
import { GamesHubApp } from './components/pages/GamesHubApp';
import { MusicPlayerApp } from './components/pages/MusicPlayerApp';
import { VideoPlayerApp } from './components/pages/VideoPlayerApp';
import { PasswordsApp } from './components/pages/PasswordsApp';
import { ExtensionsApp } from './components/pages/ExtensionsApp';
import { SettingsApp } from './components/pages/SettingsApp';
import { GenericWebPage } from './components/pages/GenericWebPage';

import { storageService } from './services/storage';
import { audioEngine } from './services/audioEngine';
import { Bookmark, SavedLogin, Tab, ViewportMode } from './types/browser';

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>(() => storageService.getTabs());
  const [activeTabId, setActiveTabId] = useState<string>(() => storageService.getActiveTabId());
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop-full');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tools & Modals
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isMusicWidgetOpen, setIsMusicWidgetOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Floating PiP
  const [pipState, setPipState] = useState<{
    isOpen: boolean;
    src?: string;
    title?: string;
  }>({
    isOpen: false,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Background Live Stream',
  });

  // Save Password Prompt
  const [savePasswordPrompt, setSavePasswordPrompt] = useState<{
    isOpen: boolean;
    pendingLogin: {
      website: string;
      domain: string;
      username: string;
      password: string;
      category?: SavedLogin['category'];
    } | null;
  }>({
    isOpen: false,
    pendingLogin: null,
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => storageService.getBookmarks());

  // Listen to background audio state
  useEffect(() => {
    return audioEngine.subscribe((s) => setIsAudioPlaying(s.isPlaying));
  }, []);

  // Save tabs & active tab on change
  useEffect(() => {
    storageService.saveTabs(tabs);
  }, [tabs]);

  useEffect(() => {
    storageService.saveActiveTabId(activeTabId);
  }, [activeTabId]);

  // Find active tab safely
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || {
    id: 'tab-start',
    title: 'New Tab',
    url: 'nova://start',
    history: ['nova://start'],
    historyIndex: 0,
    isLoading: false,
    isMuted: false,
    isPinned: false,
    isIncognito: false,
  };

  const isBookmarked = bookmarks.some((b) => b.url === activeTab.url);

  // Navigation handlers
  const handleNavigate = useCallback(
    (inputUrl: string) => {
      let finalUrl = inputUrl.trim();
      let title = 'Web Page';

      if (finalUrl === 'nova://start' || finalUrl === 'start') {
        finalUrl = 'nova://start';
        title = 'New Tab';
      } else if (finalUrl.includes('instagram.com') || finalUrl === 'instagram') {
        finalUrl = 'https://instagram.com';
        title = 'Instagram';
      } else if (finalUrl === 'nova://games' || finalUrl === 'games') {
        finalUrl = 'nova://games';
        title = 'Web Games Hub';
      } else if (finalUrl === 'nova://music' || finalUrl === 'music') {
        finalUrl = 'nova://music';
        title = 'Background Audio';
      } else if (finalUrl === 'nova://video' || finalUrl === 'video') {
        finalUrl = 'nova://video';
        title = 'Video & PiP Player';
      } else if (finalUrl === 'nova://passwords' || finalUrl === 'passwords') {
        finalUrl = 'nova://passwords';
        title = 'Password & Login Vault';
      } else if (finalUrl === 'nova://extensions' || finalUrl === 'extensions') {
        finalUrl = 'nova://extensions';
        title = 'Extensions Store';
      } else if (finalUrl === 'nova://settings' || finalUrl === 'settings') {
        finalUrl = 'nova://settings';
        title = 'Settings';
      } else if (finalUrl === 'nova://devtools' || finalUrl === 'devtools') {
        setIsDevToolsOpen(true);
        return;
      } else if (!finalUrl.includes('.') && !finalUrl.startsWith('http')) {
        // Query search
        title = `Search: ${finalUrl}`;
        finalUrl = `https://google.com/search?q=${encodeURIComponent(finalUrl)}`;
      } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
        title = finalUrl.replace('https://', '').split('/')[0];
      } else {
        title = finalUrl.replace(/^https?:\/\//, '').split('/')[0];
      }

      // Add to browsing history
      storageService.addHistory(title, finalUrl);

      // Update current tab
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId) {
            const nextHistory = t.history.slice(0, t.historyIndex + 1);
            nextHistory.push(finalUrl);
            return {
              ...t,
              url: finalUrl,
              title,
              history: nextHistory,
              historyIndex: nextHistory.length - 1,
              isLoading: false,
            };
          }
          return t;
        })
      );
    },
    [activeTabId]
  );

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const index = tabs.findIndex((t) => t.id === id);
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      const nextActive = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  const handleNewTab = () => {
    const newId = 'tab-' + Date.now();
    const newTab: Tab = {
      id: newId,
      title: 'New Tab',
      url: 'nova://start',
      favicon: 'Globe',
      history: ['nova://start'],
      historyIndex: 0,
      isLoading: false,
      isMuted: false,
      isPinned: false,
      isIncognito: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const targetUrl = activeTab.history[newIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url: targetUrl, historyIndex: newIndex, title: targetUrl.split('//')[1] || 'Page' }
            : t
        )
      );
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const targetUrl = activeTab.history[newIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, url: targetUrl, historyIndex: newIndex, title: targetUrl.split('//')[1] || 'Page' }
            : t
        )
      );
    }
  };

  const handleReload = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 600);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      storageService.removeBookmark(activeTab.url);
    } else {
      storageService.addBookmark({
        title: activeTab.title,
        url: activeTab.url,
      });
    }
    setBookmarks(storageService.getBookmarks());
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleNewTab();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        handleCloseTab(activeTabId);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPrintModalOpen(true);
      } else if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'F12') {
        e.preventDefault();
        setIsDevToolsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId]);

  // Render tab content
  const renderTabContent = () => {
    const url = activeTab.url;

    if (url === 'nova://start') {
      return <StartPage onNavigate={handleNavigate} />;
    }
    if (url.includes('instagram.com')) {
      return (
        <InstagramApp
          onNavigate={handleNavigate}
          onTriggerSavePassword={(login) => {
            setSavePasswordPrompt({
              isOpen: true,
              pendingLogin: login,
            });
          }}
        />
      );
    }
    if (url === 'nova://games' || url.includes('games')) {
      return <GamesHubApp />;
    }
    if (url === 'nova://music' || url.includes('music')) {
      return <MusicPlayerApp />;
    }
    if (url === 'nova://video' || url.includes('video')) {
      return (
        <VideoPlayerApp
          onTriggerPiP={(src, title) => {
            setPipState({ isOpen: true, src, title });
          }}
        />
      );
    }
    if (url === 'nova://passwords' || url.includes('passwords')) {
      return <PasswordsApp onNavigateToSite={handleNavigate} />;
    }
    if (url === 'nova://extensions' || url.includes('extensions')) {
      return <ExtensionsApp />;
    }
    if (url === 'nova://settings' || url.includes('settings')) {
      return <SettingsApp />;
    }

    return (
      <GenericWebPage
        url={url}
        onNavigate={handleNavigate}
        onTriggerSavePassword={(login) => {
          setSavePasswordPrompt({
            isOpen: true,
            pendingLogin: login,
          });
        }}
      />
    );
  };

  return (
    <div className={`w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'p-0' : ''}`}>
      {/* 1. Chrome-style Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        isAudioPlaying={isAudioPlaying}
      />

      {/* 2. Omnibox Navigation Address Bar */}
      <AddressBar
        activeTab={activeTab}
        canGoBack={activeTab.historyIndex > 0}
        canGoForward={activeTab.historyIndex < activeTab.history.length - 1}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onReload={handleReload}
        onGoHome={() => handleNavigate('nova://start')}
        onNavigate={handleNavigate}
        viewportMode={viewportMode}
        onChangeViewportMode={setViewportMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenDevTools={() => setIsDevToolsOpen(!isDevToolsOpen)}
        isDevToolsOpen={isDevToolsOpen}
        onToggleMusicWidget={() => setIsMusicWidgetOpen(!isMusicWidgetOpen)}
        isMusicWidgetOpen={isMusicWidgetOpen}
        onTriggerPiP={() => setPipState((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
        onOpenPasswords={() => handleNavigate('nova://passwords')}
        onOpenExtensions={() => handleNavigate('nova://extensions')}
        onOpenSettings={() => handleNavigate('nova://settings')}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={isBookmarked}
      />

      {/* 3. Bookmarks Quick Access Bar */}
      <BookmarksBar onNavigate={handleNavigate} activeUrl={activeTab.url} />

      {/* 4. Browser Viewport Area (supports Desktop mode, Tablet, Mobile) */}
      <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-950">
        <ViewportFrame mode={viewportMode}>{renderTabContent()}</ViewportFrame>

        {/* Save Password Prompt (floating from top right of address bar) */}
        <SavePasswordPrompt
          isOpen={savePasswordPrompt.isOpen}
          onClose={() => setSavePasswordPrompt({ isOpen: false, pendingLogin: null })}
          pendingLogin={savePasswordPrompt.pendingLogin}
          onSave={(login) => {
            storageService.saveOrUpdateLogin({
              ...login,
              category: login.category || 'social',
            });
          }}
        />

        {/* Background Music floating station controller */}
        <BackgroundMusicWidget
          isOpen={isMusicWidgetOpen}
          onClose={() => setIsMusicWidgetOpen(false)}
        />

        {/* Floating Picture-in-Picture window (persists across tabs) */}
        <FloatingPiP
          isOpen={pipState.isOpen}
          videoSrc={pipState.src}
          videoTitle={pipState.title}
          onClose={() => setPipState((prev) => ({ ...prev, isOpen: false }))}
          onExpandToTab={() => {
            setPipState((prev) => ({ ...prev, isOpen: false }));
            handleNavigate('nova://video');
          }}
        />
      </div>

      {/* 5. Developer Tools Panel (Console, DOM Elements, Network, Storage) */}
      <DevTools
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
        activeTab={activeTab}
      />

      {/* 6. Print Preview Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        activeTab={activeTab}
      />
    </div>
  );
}
