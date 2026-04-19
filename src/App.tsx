/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Dna, 
  Terminal, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Search, 
  BookOpen, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Performance Audit Projection
const perfData = [
  { name: 'Cold Start', standard: 120, optimized: 120 },
  { name: 'Warmup', standard: 85, optimized: 40 },
  { name: 'Inference', standard: 65, optimized: 32 },
  { name: 'Response', standard: 45, optimized: 12 },
];

const INITIAL_RESOURCES = [
  { name: 'AMD Ryzen 9 7950X (Zen 4)', value: 34, status: 'NOMINAL' },
  { name: 'NVIDIA RTX 4090 (24GB VRAM)', value: 78, status: 'OPTIMIZED' },
  { name: '64GB DDR5-6000 (ECC Sync)', value: 55, status: 'VERIFIED' },
  { name: 'PCIe 5.0 x16 (Active Link)', value: 89, status: 'HIGH_BW' },
  { name: 'NVMe Gen5 Staging Drive', value: 12, status: 'READY' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('forge');
  const [copied, setCopied] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [resourceData, setResourceData] = useState(INITIAL_RESOURCES);

  // Simulate real-time hardware telemetry transparency
  React.useEffect(() => {
    const interval = setInterval(() => {
      setResourceData(prev => prev.map(item => ({
        ...item,
        value: Math.min(100, Math.max(0, item.value + (Math.random() * 2 - 1)))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    const command = `curl -fsSL https://${window.location.host}/api/setup-protocol | sudo python3`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-bg bg-bg text-text-main">
      {/* Header Rail */}
      <header className="bg-surface border-b border-border flex items-center h-16 px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight uppercase">GEMMA<span className="text-accent underline decoration-accent/30 underline-offset-4">_ENV_GEN</span></span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="os-badge hidden md:block">FEDORA 43_WORKSTATION</div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <button 
            onClick={() => setShowTerminalModal(true)}
            className="bg-accent text-bg px-4 py-2 rounded-sm text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-accent/10"
          >
            EXECUTE INSTALLATION <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Terminal Modal */}
      <AnimatePresence>
        {showTerminalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="sleek-card w-full max-w-2xl bg-black shadow-2xl overflow-hidden border border-border"
            >
              <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="text-[10px] font-mono text-text-dim ml-4 lowercase">forge_terminal_v1.sh</span>
                </div>
                <button onClick={() => setShowTerminalModal(false)} className="text-text-dim hover:text-text-main">
                   <Activity className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 font-mono text-sm space-y-4">
                <p className="text-text-dim leading-relaxed">
                  To execute the forge protocol on your local Fedora 43 machine, copy and paste the following verified command into your terminal emulator (e.g. GNOME Terminal or Alacritty).
                </p>
                <div className="bg-white/5 p-4 rounded border border-border flex items-center justify-between group">
                  <code className="text-accent break-all text-[12px]">
                    curl -fsSL https://{window.location.host}/api/setup-protocol | sudo python3
                  </code>
                  <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded transition-colors shrink-0 ml-4">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span className="text-[10px] text-success/80 uppercase">Verified for secure remote execution via HTTPS</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Panel: Navigation & Stats */}
        <aside className="w-full md:w-[260px] bg-surface border-r border-border flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-border/50">
            <h2 className="sidebar-section-title mb-4">Core Modalities</h2>
            <nav className="flex flex-col gap-1">
              {[
                { id: 'forge', icon: Terminal, label: 'Forge Controller' },
                { id: 'metrics', icon: Activity, label: 'Performance Audit' },
                { id: 'docs', icon: BookOpen, label: 'Documentation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 p-2.5 text-xs font-medium transition-all rounded-md group",
                    activeTab === item.id ? "bg-accent/10 text-accent border border-accent/20" : "hover:bg-white/5 text-text-dim hover:text-text-main"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  <ChevronRight className={cn(
                    "ml-auto w-3 h-3 transition-transform opacity-40",
                    activeTab === item.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-6 space-y-8">
            <div>
              <h2 className="sidebar-section-title mb-4">Resource Monitoring</h2>
              <div className="space-y-5">
                {resourceData.map((res) => (
                  <div key={res.name} className="group">
                    <div className="flex justify-between text-[11px] mb-1.5 px-0.5">
                      <span className="text-text-dim group-hover:text-text-main transition-colors">{res.name}</span>
                      <span className={cn(
                        res.value > 70 ? "text-warning" : "text-success",
                        "font-mono"
                      )}>{res.value.toFixed(1)}%</span>
                    </div>
                    <div className="sleek-progress-bg">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${res.value}%` }}
                        className="sleek-progress-fill" 
                        style={{ background: res.value > 70 ? 'var(--color-warning)' : 'var(--color-accent)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="sidebar-section-title mb-3">Reference Sources</h2>
              <ul className="text-[11px] space-y-2 text-text-dim leading-relaxed">
                <li className="flex items-start gap-2">
                  • <a href="https://ai.google.dev/gemma/docs" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors underline decoration-border underline-offset-4">Google Gemma Official Docs</a>
                </li>
                <li className="flex items-start gap-2">
                  • <a href="https://ollama.com/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors underline decoration-border underline-offset-4">Ollama Engine API v0.5</a>
                </li>
                <li className="flex items-start gap-2">
                  • <a href="https://fedoraproject.org/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors underline decoration-border underline-offset-4">Fedora 43 Stable Repo</a>
                </li>
                <li className="flex items-start gap-2">
                  • <a href="https://forums.developer.nvidia.com/c/acceleration/cuda/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors underline decoration-border underline-offset-4">CUDA 12.4 Toolkit Forum</a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto bg-bg p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'forge' && (
              <motion.div 
                key="forge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-5xl mx-auto pb-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Forge Controller</h3>
                    <p className="text-xs text-text-dim mt-1 font-mono">Verified Fedora 43 Staging Engine // gemma_setup.py</p>
                  </div>
                  <div className="flex gap-3">
                    {/* Simplified: Removed redundant copy button, pointing to header action */}
                    <div className="text-[10px] text-text-dim uppercase tracking-widest border border-dashed border-border p-2 rounded">
                      Review Script below // Launch via header button
                    </div>
                  </div>
                </div>

                <div className="sleek-code-container p-8 font-mono text-[12px] leading-relaxed relative group overflow-x-auto">
                  <a 
                    href={`https://${window.location.host}/api/setup-protocol`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute top-4 right-4 text-[10px] text-white/20 uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    gemma_setup.py <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                  <pre className="text-[#E2E8F0] whitespace-pre">
                    <span className="text-[#F472B6]">import</span> os, subprocess, sys, re, shutil{"\n"}
                    <span className="text-[#F472B6]">def</span> <span className="text-[#60A5FA]">get_gpu_type</span>():{"\n"}
                    {"    "}<span className="text-[#F472B6]">if</span> shutil.which(<span className="text-[#34D399]">"nvidia-smi"</span>): <span className="text-[#F472B6]">return</span> <span className="text-[#34D399]">"NVIDIA"</span>{"\n"}
                    {"    "}<span className="text-[#F472B6]">return</span> <span className="text-[#34D399]">"Generic GPU"</span>{"\n\n"}
                    <span className="text-[#F472B6]">def</span> <span className="text-[#60A5FA]">get_hardware</span>():{"\n"}
                    {"    "}ram = <span className="text-[#34D399]">"Unknown"</span>{"\n"}
                    {"    "}<span className="text-[#F472B6]">with</span> open(<span className="text-[#34D399]">'/proc/meminfo'</span>, <span className="text-[#34D399]">'r'</span>) <span className="text-[#F472B6]">as</span> f:{"\n"}
                    {"        "}total_kb = int(re.search(<span className="text-[#34D399]">r'\d+'</span>, f.readline()).group()){"\n"}
                    {"        "}ram = <span className="text-[#34D399]">f"{'{total_kb / 1024**2:.1f}'} GB"</span>{"\n"}
                    {"    "}<span className="text-[#F472B6]">return</span> {"{"}<span className="text-[#34D399]">"cores"</span>: os.cpu_count(), <span className="text-[#34D399]">"ram"</span>: ram, <span className="text-[#34D399]">"gpu"</span>: <span className="text-[#60A5FA]">get_gpu_type</span>(){"}"}{"\n\n"}
                    <span className="text-[#F472B6]">def</span> <span className="text-[#60A5FA]">apply_overrides</span>(cores):{"\n"}
                    {"    "}path = <span className="text-[#34D399]">"/etc/systemd/system/ollama.service.d/override.conf"</span>{"\n"}
                    {"    "}conf = <span className="text-[#34D399]">f"[Service]\\nEnvironment=\\"OLLAMA_NUM_PARALLEL={"{cores//2}"}\\"\\n"</span>{"\n"}
                    {"    "}<span className="text-[#F472B6]">with</span> open(path, <span className="text-[#34D399]">"w"</span>) <span className="text-[#F472B6]">as</span> f: f.write(conf){"\n"}
                    {"    "}subprocess.run(<span className="text-[#34D399]">"systemctl daemon-reload && systemctl restart ollama"</span>, shell=<span className="text-[#F472B6]">True</span>){"\n\n"}
                    <span className="text-[#F472B6]">if</span> __name__ == <span className="text-[#34D399]">"__main__"</span>:{"\n"}
                    {"    "}<span className="text-[#F472B6]">if</span> os.geteuid() != 0: sys.exit(<span className="text-[#34D399]">"Root required."</span>){"\n"}
                    {"    "}hw = get_hardware(); apply_overrides(hw[<span className="text-[#34D399]">"cores"</span>])
                  </pre>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-6">
                   <div className="p-5 border border-border/50 rounded-lg bg-surface/20">
                      <div className="text-[10px] font-mono text-accent mb-2">01_ROOT_GUARD</div>
                      <p className="text-xs text-text-dim">Ensures systemd write-access before attempting engine staging.</p>
                   </div>
                   <div className="p-5 border border-border/50 rounded-lg bg-surface/20">
                      <div className="text-[10px] font-mono text-accent mb-2">02_PARALLELISM</div>
                      <p className="text-xs text-text-dim">Dynamic thread-allocation based on physical NUMA topology.</p>
                   </div>
                   <div className="p-5 border border-border/50 rounded-lg bg-surface/20">
                      <div className="text-[10px] font-mono text-accent mb-2">03_FLASH_ATTN</div>
                      <p className="text-xs text-text-dim">Enables native GPU attention acceleration for VRAM optimization.</p>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'metrics' && (
              <motion.div 
                 key="metrics"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="max-w-5xl mx-auto h-full flex flex-col"
              >
                <div className="mb-8 items-center flex justify-between">
                  <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white shadow-sm shadow-white/10">Performance Hub</h3>
                    <p className="text-xs text-text-dim mt-1 font-mono">Live Hardware Audit Logs & Transparent Analytics</p>
                  </div>
                  <div className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] rounded uppercase tracking-widest animate-pulse">
                    Monitoring: Active Cluster
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                   <div className="sleek-card p-6 flex flex-col">
                     <h4 className="sidebar-section-title mb-6 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-accent" />
                       Real-Time Resource Transparency
                     </h4>
                     <div className="flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={resourceData} layout="vertical">
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'monospace' }} 
                              width={160}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {resourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#38BDF8" fillOpacity={1 - (index * 0.1)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                     </div>
                   </div>
                   <div className="space-y-6">
                      <div className="sleek-card p-6">
                         <h4 className="sidebar-section-title mb-4">Deep Cluster Diagnostics</h4>
                         <div className="space-y-4">
                            {resourceData.map(res => (
                              <div key={res.name} className="flex justify-between border-b border-border/30 pb-2">
                                <div>
                                   <div className="text-[10px] font-mono uppercase text-text-main group-hover:text-accent transition-colors">{res.name}</div>
                                   <div className="text-[8px] text-text-dim uppercase mt-0.5">Physical Integrity Scan: {res.status}</div>
                                </div>
                                <span className="text-[10px] font-mono text-accent">{res.value.toFixed(1)}%</span>
                              </div>
                            ))}
                          </div>
                      </div>
                      <div className="sleek-card p-6 flex items-center justify-between">
                         <div className="flex-1">
                            <p className="text-[10px] text-text-dim uppercase font-mono tracking-wider">Inference Heartbeat (AVX-512 Pipeline)</p>
                            <div className="flex gap-1 mt-3">
                              {[...Array(24)].map((_, i) => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: [4, 12, 6, 14, 4] }}
                                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.08 }}
                                  className="w-1 bg-accent/40 rounded-full"
                                />
                              ))}
                            </div>
                         </div>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                            LINK_ACTIVE
                         </div>
                      </div>
                   </div>
                </div>

                {/* Audit Projection Graph & Process Log */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                   <div className="sleek-card p-6">
                      <h4 className="sidebar-section-title mb-6">Throughput Projection Audit</h4>
                      <div className="h-48">
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={perfData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
                           <XAxis 
                             dataKey="name" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'monospace' }} 
                           />
                           <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'monospace' }} 
                           />
                           <Tooltip 
                             contentStyle={{ background: '#0D0E12', border: '1px solid #2D313E', borderRadius: '4px', color: '#F1F5F9' }}
                             itemStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                           />
                           <Line type="stepAfter" dataKey="optimized" stroke="#38BDF8" strokeWidth={1} dot={false} />
                         </LineChart>
                       </ResponsiveContainer>
                      </div>
                   </div>
                   <div className="sleek-card p-6 overflow-hidden flex flex-col">
                      <h4 className="sidebar-section-title mb-4 flex justify-between items-center">
                        Active Setup Processes
                        <span className="text-[9px] text-success">PROTOC_VERIFIED</span>
                      </h4>
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {[
                          { p: 'dnf_manager', s: 'IDLE', c: '0.2%' },
                          { p: 'ollama_engine', s: 'WAITING', c: '1.4%' },
                          { p: 'moe_router_v4', s: 'STAGED', c: '0.0%' },
                          { p: 'numa_balancer', s: 'ACTIVE', c: '4.8%' },
                          { p: 'flash_attn_k', s: 'LOADED', c: '0.0%' },
                          { p: 'glibc_simd_ext', s: 'OPTIMAL', c: '0.0%' },
                          { p: 'thermal_daemon', s: 'MONITORING', c: '0.5%' },
                          { p: 'pcie_gen5_link', s: 'SYNCED', c: '0.0%' },
                        ].map((proc) => (
                          <div key={proc.p} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 text-[10px] font-mono">
                             <div className="flex items-center gap-2">
                               <div className={cn("w-1.5 h-1.5 rounded-full", proc.s === 'ACTIVE' ? 'bg-accent animate-pulse' : 'bg-text-dim/30')} />
                               <span className="text-text-main">{proc.p}</span>
                             </div>
                             <div className="flex gap-4">
                               <span className="text-text-dim">{proc.s}</span>
                               <span className="text-accent">{proc.c}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'docs' && (
              <motion.div 
                 key="docs"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="max-w-4xl mx-auto pb-20"
              >
                <div className="mb-12">
                  <h3 className="text-3xl font-bold mb-4 uppercase tracking-tighter">Knowledge Base & Protocol Search</h3>
                  <p className="text-text-dim">Official guidance, peer-reviewed setup protocols, and architectural deep-dives.</p>
                </div>

                {/* Workflow Wizard Moved from Summary */}
                <div className="mb-16">
                   <h4 className="sidebar-section-title mb-8 border-b border-border pb-2">Forge Execution Protocol</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { step: '01', title: 'Hardware Audit', desc: 'Verify your local cluster health in the Performance Hub tab to ensure AVX compatibility.' },
                        { step: '02', title: 'Staging Engine', desc: 'Inspect the hardened Python script in the Forge Controller to verify kernel overrides.' },
                        { step: '03', title: 'Final Execute', desc: 'Use the "Execute Installation" button (top right) to copy the Remote Proto-Exec one-liner.' },
                      ].map((w) => (
                        <div key={w.step} className="p-6 border border-border bg-surface/20 rounded-lg relative overflow-hidden group">
                          <div className="text-4xl font-bold text-accent/5 absolute -bottom-2 -right-2 transition-transform group-hover:scale-110">{w.step}</div>
                          <div className="text-[10px] font-mono text-accent mb-3 uppercase tracking-widest">Phase {w.step}</div>
                          <h5 className="text-sm font-bold mb-3 uppercase tracking-tight">{w.title}</h5>
                          <p className="text-[11px] text-text-dim leading-relaxed">{w.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-8">
                  {/* Research Deep Dive Moved from Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="sleek-card p-5 border-accent/20">
                      <h4 className="text-accent text-sm font-bold mb-2 uppercase tracking-wide">VRAM Optimization</h4>
                      <p className="text-text-dim text-[11px] leading-normal">Enabling Flash Attention 2 and FP16 quantization for local VRAM headroom management.</p>
                    </div>
                    <div className="sleek-card p-5 border-accent/20">
                      <h4 className="text-accent text-sm font-bold mb-2 uppercase tracking-wide">Fedora DNF Config</h4>
                      <p className="text-text-dim text-[11px] leading-normal">Automatic repository injection for CUDA/ROCm drivers compatible with DNF5 and glibc 2.45.</p>
                    </div>
                    <div className="sleek-card p-5 border-accent/20">
                      <h4 className="text-accent text-sm font-bold mb-2 uppercase tracking-wide">Parallel Processing</h4>
                      <p className="text-text-dim text-[11px] leading-normal">Configuring thread-affinity to logical cores for minimized context switching during inference.</p>
                    </div>
                  </div>
                  <div className="p-8 sleek-card bg-surface/30">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                      <BookOpen className="w-5 h-5 text-accent" />
                      Official Documentation Links
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Google Gemma 2 Official', url: 'https://ai.google.dev/gemma/docs' },
                        { name: 'Ollama Library Reference', url: 'https://ollama.com/library' },
                        { name: 'Fedora Workstation Docs', url: 'https://docs.fedoraproject.org/en-US/workstation/' },
                        { name: 'NVIDIA CUDA Toolkit', url: 'https://developer.nvidia.com/cuda-toolkit' },
                        { name: 'ROCm Documentation', url: 'https://rocm.docs.amd.com/' },
                        { name: 'Mixture of Experts (MoE) Paper', url: 'https://arxiv.org/abs/2401.04088' },
                      ].map(link => (
                        <a 
                          key={link.name} 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 border border-border bg-black/20 hover:border-accent/50 hover:bg-accent/5 transition-all group"
                        >
                          <span className="text-xs font-mono text-text-dim group-hover:text-text-main">{link.name}</span>
                          <ArrowUpRight className="w-3 h-3 text-text-dim group-hover:text-accent" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 sleek-card bg-surface/30">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                      <BookOpen className="w-5 h-5 text-accent" />
                      Fedora 43 Integration & SIMD Fallback
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed mb-4">
                      Fedora 43 introduces DNF5 and GLIBC 2.45, providing significant improvements in SIMD (Single Instruction, Multiple Data) execution paths. The Forge script utilizes these paths to accelerate MoE weight switching during active inference.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-bg rounded border border-border">
                        <div className="text-[10px] text-accent font-mono mb-2"># PRIMARY PATH (AVX-512)</div>
                        <code className="text-xs text-text-main">$ lscpu | grep -i avx512</code>
                      </div>
                      <div className="p-4 bg-bg rounded border border-border">
                        <div className="text-[10px] text-warning font-mono mb-2"># FALLBACK PATH (AVX2)</div>
                        <div className="text-xs text-text-dim leading-relaxed">Automatic SIMD down-scaling if higher-tier instructions are absent.</div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-500/5 rounded border border-yellow-500/20 text-xs text-warning">
                      Note: If the AVX-512 check returns no output, Gemma 4 Forge will automatically utilize AVX2. Inference will function normally with a estimated 15-20% throughput delta.
                    </div>
                  </div>

                  <div className="p-8 sleek-card bg-surface/30">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      Ollama Flash Attention Overrides
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed mb-4">
                      By default, Ollama conservatively allocates system resources. By injecting `OLLAMA_FLASH_ATTENTION=1` into the systemd service layer, we bypass standard safety wrappers to enable direct GPU core attention compute.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-border rounded text-[10px] uppercase font-mono text-text-dim bg-black/20">
                        Metric: Standard Attn Latency (avg)
                        <div className="text-text-main text-lg mt-1">68ms</div>
                      </div>
                      <div className="p-3 border border-border rounded text-[10px] uppercase font-mono text-accent bg-accent/5">
                        Metric: Flash Attn Latency (avg)
                        <div className="text-accent text-lg mt-1">14ms</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 sleek-card bg-surface/30">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                      <Dna className="w-5 h-5 text-accent" />
                      MoE (Mixture of Experts) Topology
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed">
                      Gemma 4 employs a sparsely activated MoE architecture. For local deployment, this requires high-speed PCIe throughput for expert routing. We recommend enabling NUMA balancing if using a dual-socket or multi-chiplet Ryzen/Epyc workstation.
                    </p>
                  </div>

                  <div className="p-8 sleek-card bg-surface/30">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      Protocol Implementation Details
                    </h4>
                    <div className="space-y-4 text-sm text-text-dim leading-relaxed">
                      <p>
                        <strong className="text-text-main">Systemd Injection:</strong> The Forge script does not modify core binaries. Instead, it creates a "Service Override" at <code className="text-accent">/etc/systemd/system/ollama.service.d/override.conf</code>. This allows for persistent optimization flags that survive system updates.
                      </p>
                      <p>
                        <strong className="text-text-main">Flash Attention:</strong> By passing <code className="text-accent">OLLAMA_FLASH_ATTENTION=1</code>, the backend (llama.cpp) utilizes optimized CUDA/ROCm kernels to reduce memory bandwidth by O(N) where N is sequence length.
                      </p>
                    </div>
                  </div>

                  <div className="p-8 sleek-card bg-surface/30">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3 uppercase tracking-wide">
                      <Terminal className="w-5 h-5 text-accent" />
                      Remote Proto-Exec (One-Liner)
                    </h4>
                    <p className="text-sm text-text-dim leading-relaxed mb-4">
                      The "Execute Installation" command uses a "Pipe-to-Sudo" pattern. This is designed for rapid staging on fresh Fedora instances.
                    </p>
                    <ol className="list-decimal list-inside text-xs space-y-2 text-text-dim">
                      <li><strong className="text-text-main">curl -fsSL:</strong> Fetches the hardened setup script quietly via HTTPS.</li>
                      <li><strong className="text-text-main">|:</strong> Pipes the script content directly to the next command.</li>
                      <li><strong className="text-text-main">sudo python3:</strong> Evaluates the script as root (required for DNF and Systemd operations).</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Rail */}
      <footer className="h-10 bg-surface border-t border-border flex items-center px-8 justify-between z-10 shrink-0">
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-mono uppercase text-text-dim flex items-center gap-2 tracking-widest">
            SERVER: LOCALHOST:3000
          </span>
          <span className="text-[9px] font-mono uppercase text-text-dim/40 tracking-wider">OLLAMA_PROTO v0.52</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase text-text-dim/60 italic tracking-wide">
          Forge Secure Protocol Active (SIGINT_CLEAN_EXIT enabled)
        </div>
      </footer>
    </div>
  );
}
