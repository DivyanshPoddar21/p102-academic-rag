import React, { useState } from 'react';
import { api } from '../services/api';
import type { QuestionResponse } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  LogOut, 
  Sliders, 
  Database,
  Layers
} from 'lucide-react';

interface Props {
  user: string;
  onLogout: () => void;
}

export const WorkspacePage: React.FC<Props> = ({ user, onLogout }) => {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(3);
  const [threshold, setThreshold] = useState(0.45);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuestionResponse | null>(null);

  const handleSearch = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;
    setLoading(true);

    try {
      const res = await api.askQuestion({
        question: q,
        top_k: topK,
        confidence_threshold: threshold
      });
      setData(res);
    } catch (err) {
      console.error('Error querying QA backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      <header className="h-16 border-b border-slate-800/80 bg-[#0e131f]/90 px-6 flex items-center justify-between backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            V
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-white">VERITAS / Academic QA Gateway</div>
            <div className="text-[11px] text-slate-400">Department of Computer Science & Engineering — Machine Learning Techniques</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 font-mono">
            ● JWT AUTHENTICATED
          </span>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {user.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-200">{user}</div>
              <div className="text-[10px] text-slate-400">CS-ML-2024-8841</div>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1550px] w-full mx-auto p-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-5">
          <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-medium text-xs uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>Query Configuration</span>
              </div>
              <button 
                onClick={() => { setTopK(3); setThreshold(0.45); }}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Retrieval Chunks (Top-k)</span>
                <span className="font-mono text-indigo-400 font-semibold">{topK}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={topK} 
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Number of top vector passages injected into generation context.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Hallucination Gate</span>
                <span className="font-mono text-indigo-400 font-semibold">{threshold.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.20" 
                max="0.95" 
                step="0.05"
                value={threshold} 
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Queries scoring below threshold are rejected to prevent synthetic hallucinations.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-300 font-medium">Embedding Engine</span>
              </div>
              <span className="font-mono text-[11px] text-indigo-300">all-MiniLM-L6-v2</span>
            </div>
          </div>

          <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Index Diagnostics</div>
              <span className="text-[11px] text-emerald-400 font-medium">● Verified</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">MLT Unit 1.1.pdf</div>
                <div className="text-[11px] text-slate-400">Course Grounding Knowledge Base</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] uppercase text-slate-400">Total Chunks</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">38</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] uppercase text-slate-400">Retriever Type</div>
                <div className="text-sm font-semibold text-emerald-400 mt-1">FAISS Index</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-5">
          <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Explain Supervised Learning paradigms, Arthur Samuel's definition, or inductive bias..."
                  className="w-full bg-[#0b0f17] border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Synthesizing...' : 'Inquire'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px]">Suggestions:</span>
              {[
                'What is machine learning?',
                'Define Supervised vs Unsupervised Learning',
                'What is an inductive bias?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => { setQuery(chip); handleSearch(chip); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition text-[11px]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {data ? (
            <div className="space-y-5">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                data.gated 
                  ? 'bg-amber-950/30 border-amber-800/60 text-amber-300' 
                  : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              }`}>
                <div className="flex items-center gap-3">
                  {data.gated ? (
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {data.gated ? 'Confidence Gate Triggered: Out of Scope' : 'Verified Grounding Output'}
                    </div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      {data.gated 
                        ? 'The query fell below relevance threshold. Synthetic hallucination blocked.'
                        : 'Context retrieved directly from course PDF and validated by confidence threshold.'}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-semibold">Score: {data.confidence_score.toFixed(4)}</div>
                  <div className="text-[10px] opacity-75">Target ≥ {threshold}</div>
                </div>
              </div>

              <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Academic Synthesis
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Model: {data.model}</span>
                </div>
                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.answer}
                </div>
              </div>

              {data.citations && data.citations.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Verified Citation Passages (Top-{data.citations.length} Retrieval)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.citations.map((c, idx) => (
                      <div key={idx} className="bg-[#111726] border border-slate-800/80 rounded-xl p-4 space-y-2 hover:border-slate-700 transition">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-indigo-400">Page {c.page_number}</span>
                          <span className="font-mono text-[11px] text-slate-400">Score: {c.score.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{c.source}</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Grounded Source Chunk</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#111726]/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <div className="text-sm font-medium text-slate-400">No active inquiry</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Enter an academic concept or click one of the suggested prompts above to synthesize answers with verified citations.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};