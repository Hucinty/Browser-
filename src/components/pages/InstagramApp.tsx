import React, { useState, useEffect } from 'react';
import { Bookmark, Compass, Heart, MessageCircle, MoreHorizontal, PlusSquare, Search, Send, Share2, Shield, UserCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storage';
import { SavedLogin } from '../../types/browser';

interface InstagramAppProps {
  onTriggerSavePassword: (login: { website: string; domain: string; username: string; password: string; category?: SavedLogin['category'] }) => void;
  onNavigate?: (url: string) => void;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  location: string;
  image: string;
  caption: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: { user: string; text: string }[];
  timeAgo: string;
}

export const InstagramApp: React.FC<InstagramAppProps> = ({ onTriggerSavePassword, onNavigate }) => {
  // Check active session & saved vault logins
  const [session, setSession] = useState(() => storageService.getInstagramSession());
  const [savedLogins, setSavedLogins] = useState<SavedLogin[]>(() =>
    storageService.getLogins().filter((l) => l.domain.includes('instagram.com'))
  );

  // Form states for login
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [viewTab, setViewTab] = useState<'feed' | 'reels' | 'profile'>('feed');

  // Posts state
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p-1',
      author: 'alex.photographr',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivers',
      location: 'Shinjuku, Tokyo',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      caption: 'Late night reflections in the heart of Tokyo. Neon rain and quiet ramen stalls 🍜✨ #nightphotography #tokyo #cybercity',
      likes: 1248,
      isLiked: false,
      isSaved: false,
      comments: [
        { user: 'elena_lens', text: 'Incredible tone curve! What lens was this?' },
        { user: 'kenji.sound', text: 'Vibes are immaculate' },
      ],
      timeAgo: '2 HOURS AGO',
    },
    {
      id: 'p-2',
      author: 'retro_gaming_vault',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RetroVault',
      location: 'Arcade Museum',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      caption: 'Restored this 1986 Japanese arcade cabinet today! CRT scanlines hit different. Who remembers beating this on one quarter? 🕹️🎮',
      likes: 3410,
      isLiked: true,
      isSaved: true,
      comments: [
        { user: 'alex.photographr', text: 'Need this setup in my studio!' },
        { user: 'pixel_master', text: 'Classic memories!' },
      ],
      timeAgo: '5 HOURS AGO',
    },
    {
      id: 'p-3',
      author: 'architectural_digest',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArchDigest',
      location: 'Reykjavik, Iceland',
      image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=800&auto=format&fit=crop&q=80',
      caption: 'Minimalist Nordic cabin blending straight into volcanic moss and basalt rocks. 🏔️ Would you spend a winter here?',
      likes: 4892,
      isLiked: false,
      isSaved: false,
      comments: [
        { user: 'nordic_wanderer', text: 'Pure tranquility' },
      ],
      timeAgo: '1 DAY AGO',
    },
  ]);

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUsername.trim() || !inputPassword.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    setLoginError('');
    const newSession = {
      isLoggedIn: true,
      username: inputUsername.trim(),
      displayName: inputUsername.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inputUsername.trim()}`,
    };

    // Save session in browser
    storageService.setInstagramSession(newSession);
    setSession(newSession);

    // Save credentials in Nova Password Vault & trigger browser save prompt
    if (saveLoginInfo) {
      storageService.saveOrUpdateLogin({
        website: 'Instagram',
        domain: 'instagram.com',
        username: inputUsername.trim(),
        password: inputPassword,
        displayName: inputUsername.trim(),
        avatarUrl: newSession.avatarUrl,
        category: 'social',
      });

      onTriggerSavePassword({
        website: 'Instagram',
        domain: 'instagram.com',
        username: inputUsername.trim(),
        password: inputPassword,
        category: 'social',
      });
    }

    // Refresh saved logins
    setSavedLogins(storageService.getLogins().filter((l) => l.domain.includes('instagram.com')));
  };

  const handleQuickLoginFromVault = (login: SavedLogin) => {
    const newSession = {
      isLoggedIn: true,
      username: login.username,
      displayName: login.displayName || login.username,
      avatarUrl: login.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${login.username}`,
    };
    storageService.setInstagramSession(newSession);
    setSession(newSession);
    storageService.addLoginActivity({
      website: 'instagram.com',
      username: login.username,
      status: 'success',
    });
  };

  const handleLogout = () => {
    storageService.setInstagramSession({
      isLoggedIn: false,
      username: '',
      displayName: '',
      avatarUrl: '',
    });
    setSession({
      isLoggedIn: false,
      username: '',
      displayName: '',
      avatarUrl: '',
    });
    setSavedLogins(storageService.getLogins().filter((l) => l.domain.includes('instagram.com')));
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = newComment[postId]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, { user: session.username || 'you', text }],
          };
        }
        return p;
      })
    );
    setNewComment((prev) => ({ ...prev, [postId]: '' }));
  };

  // -------------------------------------------------------------
  // NOT LOGGED IN VIEW: Authentic Instagram Login with Vault Auto-Fill
  // -------------------------------------------------------------
  if (!session.isLoggedIn) {
    return (
      <div className="min-h-full bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-sm space-y-4">
          {/* Main Login Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
            {/* Instagram Wordmark */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent font-sans">
                Instagram
              </h1>
              <p className="text-xs text-slate-400 mt-1">Web Edition on Nova Browser</p>
            </div>

            {/* Browser Password Vault Saved Accounts banner */}
            {savedLogins.length > 0 && (
              <div className="mb-5 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nova Browser Remembered Your Account</span>
                </div>
                {savedLogins.map((saved) => (
                  <button
                    key={saved.id}
                    onClick={() => handleQuickLoginFromVault(saved)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-md group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={saved.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                        alt={saved.username}
                        className="w-6 h-6 rounded-full bg-slate-800"
                      />
                      <span className="truncate">Continue as @{saved.username}</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-90 group-hover:opacity-100">
                      1-Click Login
                    </span>
                  </button>
                ))}
              </div>
            )}

            {savedLogins.length > 0 && (
              <div className="flex items-center my-4 text-slate-500 text-xs">
                <div className="flex-1 border-t border-slate-800" />
                <span className="px-3">OR LOG IN WITH ANOTHER ACCOUNT</span>
                <div className="flex-1 border-t border-slate-800" />
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
              {loginError && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder="Phone number, username, or email"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs select-none">
                <input
                  type="checkbox"
                  checked={saveLoginInfo}
                  onChange={(e) => setSaveLoginInfo(e.target.checked)}
                  className="rounded accent-indigo-500 w-3.5 h-3.5"
                />
                <span>Save login info in Nova Browser</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg shadow-pink-500/10 transition mt-2 text-xs"
              >
                Log In
              </button>
            </form>
          </div>

          {/* Browser Vault Note */}
          <div className="text-center text-[11px] text-slate-500">
            Nova Browser preserves your active login state and credentials in local encrypted storage.
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGGED IN VIEW: Full Instagram Feed, Reels, Profile & Logout
  // -------------------------------------------------------------
  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent cursor-pointer font-sans">
            Instagram
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-xs text-slate-400 w-52">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none text-white focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewTab('feed')}
            className={`p-1.5 rounded-lg transition ${viewTab === 'feed' ? 'text-pink-400' : 'text-slate-400 hover:text-white'}`}
            title="Home Feed"
          >
            <Compass className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewTab('reels')}
            className={`p-1.5 rounded-lg transition ${viewTab === 'reels' ? 'text-pink-400' : 'text-slate-400 hover:text-white'}`}
            title="Reels"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewTab('profile')}
            className="flex items-center gap-2 p-1 hover:bg-slate-800 rounded-full transition"
            title="Profile"
          >
            <img
              src={session.avatarUrl}
              alt={session.username}
              className="w-7 h-7 rounded-full border border-pink-500/80 object-cover"
            />
          </button>
          <button
            onClick={handleLogout}
            title="Log Out (Nova will remember you)"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl mx-auto w-full py-4 px-2 sm:px-4 space-y-6">
        {/* STORIES TRAY */}
        {viewTab === 'feed' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 overflow-x-auto flex items-center gap-4 no-scrollbar">
            {/* User story */}
            <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
              <div className="relative p-0.5 rounded-full border-2 border-dashed border-slate-600">
                <img src={session.avatarUrl} alt="You" className="w-12 h-12 rounded-full" />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  +
                </span>
              </div>
              <span className="text-[11px] text-slate-300">Your story</span>
            </div>

            {/* Other stories */}
            {[
              { name: 'kenji.tokyo', seed: 'kenji', tag: 'Tokyo 🌸' },
              { name: 'sarah_art', seed: 'sarah', tag: 'Art Studio' },
              { name: 'leo_cyber', seed: 'leo', tag: 'Game Dev' },
              { name: 'chloe_travel', seed: 'chloe', tag: 'Iceland' },
              { name: 'pixel_retro', seed: 'pixel', tag: 'Arcade' },
            ].map((story) => (
              <div key={story.name} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 group-hover:scale-105 transition">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.seed}`}
                    alt={story.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-950"
                  />
                </div>
                <span className="text-[11px] text-slate-300 truncate max-w-16">{story.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* FEED POSTS */}
        {viewTab === 'feed' && (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2.5">
                    <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-slate-700" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                          {post.author}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-sky-400" />
                      </div>
                      <span className="text-[10px] text-slate-400">{post.location}</span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Post Media */}
                <div className="relative aspect-square sm:aspect-4/3 bg-black">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Post Actions */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`p-1 transition transform active:scale-125 ${
                          post.isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button className="text-slate-300 hover:text-white p-1">
                        <MessageCircle className="w-6 h-6" />
                      </button>
                      <button className="text-slate-300 hover:text-white p-1">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setPosts((prev) =>
                          prev.map((p) => (p.id === post.id ? { ...p, isSaved: !p.isSaved } : p))
                        );
                      }}
                      className={`p-1 transition ${post.isSaved ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
                    >
                      <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Likes count */}
                  <div className="text-xs font-semibold text-white font-mono tabular-nums">
                    {post.likes.toLocaleString()} likes
                  </div>

                  {/* Caption */}
                  <div className="text-xs text-slate-200">
                    <span className="font-semibold mr-1.5 text-white">{post.author}</span>
                    <span>{post.caption}</span>
                  </div>

                  {/* Comments */}
                  <div className="space-y-1 pt-1">
                    {post.comments.map((c, i) => (
                      <div key={i} className="text-xs text-slate-300">
                        <span className="font-semibold text-slate-200 mr-1.5">{c.user}</span>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono block pt-1">{post.timeAgo}</span>

                  {/* Add comment input */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="text-xs font-semibold text-pink-500 hover:text-pink-400 disabled:opacity-40 transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* REELS TAB */}
        {viewTab === 'reels' && (
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative aspect-9/16">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                loop
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-white text-xs">
                  <span className="font-bold">Reels</span>
                  <span className="bg-black/40 px-2 py-0.5 rounded-full text-[10px]">HD 60FPS</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img src={session.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-pink-500" />
                    <span className="text-xs font-bold text-white">@{session.username}</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Chasing sunsets along the cyber coast 🌅🎧 Music synced via Nova Background Audio!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {viewTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-6">
              <img
                src={session.avatarUrl}
                alt={session.username}
                className="w-20 h-20 rounded-full border-2 border-pink-500 object-cover"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white">@{session.username}</h2>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-medium">
                    Vault Saved
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span><strong>12</strong> posts</span>
                  <span><strong>1,428</strong> followers</span>
                  <span><strong>342</strong> following</span>
                </div>
                <p className="text-xs text-slate-300">
                  Digital Creator & Visual Explorer. Logged in and remembered via Nova Browser Vault.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Session persistent across tabs and browser restarts.
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-medium transition"
              >
                Log Out of Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
