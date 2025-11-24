import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Sparkles } from 'lucide-react';
import { MailMessage, Stage, GameState } from '../types';
import { generateAlienMail, MailTemplate } from '../services/mailService';
import { getNextMailWithStory } from '../storyLogic';
import { getStoryChainById } from '../storyChains';
import * as Config from '../src/config';

interface MailFeedProps {
  stage: Stage;
  gameState: GameState;
  onStateUpdate: (newState: GameState) => void;
}

export const MailFeed: React.FC<MailFeedProps> = ({ stage, gameState, onStateUpdate }) => {
  const [messages, setMessages] = useState<Array<MailMessage & { tag?: string; chainId?: string }>>([]);
  const [loading, setLoading] = useState(false);

  const fetchMail = async () => {
    if (loading) return;
    setLoading(true);

    // Get flavor mail as fallback
    const flavorMail = await generateAlienMail(stage);
    if (!flavorMail) {
      setLoading(false);
      return;
    }

    // Use story logic to decide between story and flavor mail
    const result = getNextMailWithStory(
      gameState,
      () => flavorMail as MailTemplate
    );

    // Update game state if it changed (story progress)
    if (result.updatedState !== gameState) {
      onStateUpdate(result.updatedState);
    }

    // Add the mail to the feed with story metadata
    const newMsg = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      sender: result.mail.sender,
      subject: result.mail.subject,
      body: result.mail.body,
      tag: result.mail.tag,
      chainId: result.mail.chainId,
    };
    setMessages(prev => [newMsg, ...prev].slice(0, 10)); // Keep last 10

    setLoading(false);
  };

  // Initial welcome mail
  useEffect(() => {
    setMessages([{
        id: 'intro',
        sender: 'HQ',
        subject: 'Welcome Recruit',
        body: 'Start clicking to deliver mail. Upgrades are available in the terminal.',
        timestamp: Date.now()
    }]);
  }, []);

  // Auto-fetch mail every now and then randomly
  useEffect(() => {
      const timer = setInterval(() => {
          if (Math.random() > Config.MAIL_FEED_REFRESH_PROBABILITY) {
              fetchMail();
          }
      }, Config.MAIL_FEED_REFRESH_INTERVAL_MS);
      return () => clearInterval(timer);
  }, [stage, gameState]);

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border border-slate-700 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          <Mail className="w-5 h-5" /> 
          Interstellar Comms
        </h3>
        <button 
          onClick={fetchMail} 
          disabled={loading}
          className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-10">
            No messages intercepted...
          </div>
        )}
        
        {messages.map((msg) => {
          const isStory = msg.tag === 'STORY';
          const storyChain = isStory && msg.chainId ? getStoryChainById(msg.chainId) : undefined;

          return (
            <div
              key={msg.id}
              className={`bg-slate-800/50 border rounded-lg p-3 animate-in fade-in slide-in-from-bottom-2 hover:bg-slate-800 transition-colors ${
                isStory ? 'border-amber-500/50 bg-amber-950/20' : 'border-slate-700/50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-300 text-sm truncate pr-2">{msg.sender}</span>
                  {isStory && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      STORY
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-300 mb-1 truncate">
                re: {msg.subject}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{msg.body}</p>
              {isStory && storyChain && (
                <div className="mt-2 text-[10px] text-amber-400/70 font-mono">
                  {storyChain.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};