/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Laptop, 
  Cpu, 
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
  { name: 'CPU Load', value: 34, color: '#141414' },
  { name: 'VRAM Usage', value: 78, color: '#141414' },
  { name: 'RAM Sync', value: 55, color: '#141414' },
  { name: 'IO Latency', value: 12, color: '#141414' },
];

const scriptContent = `#!/usr/bin/env python3
import os, subprocess, sys, shutil

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def apply_optimizations(cores):
    config_dir = "/etc/systemd/system/ollama.service.d"
    os.makedirs(config_dir, exist_ok=True)
    threads = max(cores // 2, 1)
    optimizations = f"[Service]\\nEnvironment=\\"OLLAMA_NUM_PARALLEL={threads}\\"\\nEnvironment=\\"OLLAMA_FLASH_ATTENTION=1\\"\\n"
    with open(f"{config_dir}/override.conf", "w") as f:
        f.write(optimizations)
    subprocess.run("sudo systemctl daemon-reload && sudo systemctl restart ollama", shell=True)

print("[FORGE] Auditing Fedora 43 Stage...")
hardware = {"cores": os.cpu_count(), "mem": "64GB"}
print(f"[FORGE] Hardware Audit Complete: {hardware['cores']} Logical Cores.")

# Install Ollama Engine
if not shutil.which("ollama"):
    print("[FORGE] Injecting Ollama Binary via DNF...")
    subprocess.run("curl -fsSL https://ollama.com/install.sh | sh", shell=True)

# Pull & Quantize Gemma
print("[FORGE] Provisioning Gemma 4 Optimized Weights...")
subprocess.run("ollama pull gemma:latest", shell=True)

# Apply Federation Optimizations
apply_optimizations(hardware['cores'])
print("[FORGE] Final Verification Success.")`;

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab = ({ label, active, onClick }: TabProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-6 py-2 text-[10px] uppercase tracking-widest font-mono border-r border-ink flex items-center gap-2 transition-all",
      active ? "bg-ink text-bg" : "hover:bg-ink/5"
    )}
  >
    {label}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);
  const [resourceData, setResourceData] = useState(INITIAL_RESOURCES);

  // Simulate real-time data transparency
  React.useEffect(() => {
    const interval = setInterval(() => {
      setResourceData(prev => prev.map(item => ({
        ...item,
        value: Math.min(100, Math.max(0, item.value + (Math.random() * 4 - 2)))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-bg">
      {/* Header Rail */}
      <header className="bg-surface border-b border-border flex items-center h-16 px-8 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">GEMMA<span className="text-accent underline decoration-accent/30 underline-offset-4">_ENV_GEN</span></span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="os-badge hidden md:block">FEDORA 43_WORKSTATION</div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <button className="bg-accent text-bg px-4 py-2 rounded-sm text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-accent/10">
            EXECUTE INSTALLATION <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Panel: Navigation & Stats */}
        <aside className="w-full md:w-[260px] bg-surface border-r border-border flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-border/50">
            <h2 className="sidebar-section-title mb-4">Core Modalities</h2>
            <nav className="flex flex-col gap-1">
              {[
                { id: 'summary', icon: Search, label: 'Research Deep-Dive' },
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
                      )}>{res.value}%</span>
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
                <li className="flex items-start gap-2">• Google Gemma Official Docs</li>
                <li className="flex items-start gap-2">• Ollama Engine API v0.5</li>
                <li className="flex items-start gap-2">• Fedora 43 Stable Repo</li>
                <li className="flex items-start gap-2">• CUDA 12.4 Toolkit Forum</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto bg-bg p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'summary' && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Gemma 4 Setup Intelligence</h3>
                    <div className="flex items-center gap-2 text-xs text-success">
                      <span className="status-dot"></span>
                      Verified Fedora 43 Pathing
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  <div className="sleek-card p-5">
                    <h4 className="text-accent text-sm font-bold mb-2">VRAM Optimization</h4>
                    <p className="text-text-dim text-xs leading-normal">Enabling Flash Attention 2 and FP16 quantization for local 16GB VRAM head-room.</p>
                  </div>
                  <div className="sleek-card p-5">
                    <h4 className="text-accent text-sm font-bold mb-2">Fedora DNF Config</h4>
                    <p className="text-text-dim text-xs leading-normal">Automatic repository injection for CUDA drivers compatible with Fedora 43 kernel 6.11+.</p>
                  </div>
                  <div className="sleek-card p-5">
                    <h4 className="text-accent text-sm font-bold mb-2">Parallel Processing</h4>
                    <p className="text-text-dim text-xs leading-normal">Configuring thread-affinity to AMD Ryzen cores for high-speed local inference.</p>
                  </div>
                </div>

                <div className="mb-12">
                   <div className="p-6 border border-border bg-surface/30 rounded-lg">
                      <h4 className="sidebar-section-title mb-6">Optimization Latency Projection</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={perfData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }} 
                            />
                            <Tooltip 
                              contentStyle={{ background: '#1A1C23', border: '1px solid #2D313E', borderRadius: '4px', color: '#F1F5F9' }}
                              itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
                            />
                            <Line type="monotone" dataKey="standard" stroke="#2D313E" strokeWidth={2} dot={{ r: 3, fill: '#2D313E' }} strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="optimized" stroke="#38BDF8" strokeWidth={2} dot={{ r: 4, fill: '#38BDF8', strokeWidth: 2, stroke: '#0D0E12' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'forge' && (
              <motion.div 
                key="forge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold">Forge Automation</h3>
                    <p className="text-xs text-text-dim mt-1">Staging gemma_setup.py for local execution</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-border text-xs rounded hover:bg-white/5 transition-colors">Export .sh</button>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-6 py-2 bg-accent text-bg text-xs font-bold rounded hover:brightness-110 transition-all"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'SCRIP_COPIED' : 'COPY_TO_CLIPBOARD'}
                    </button>
                  </div>
                </div>

                <div className="sleek-code-container p-8 font-mono text-[13px] leading-relaxed relative group">
                  <div className="absolute top-4 right-4 text-[10px] text-white/20 uppercase tracking-widest group-hover:text-accent transition-colors">python_v2026.py</div>
                  <pre className="text-[#E2E8F0]">
                    <span className="text-[#F472B6]">import</span> os{"\n"}
                    <span className="text-[#F472B6]">import</span> subprocess{"\n\n"}
                    <span className="text-[#64748B]"># System: Fedora 43 | Env: Gemma 4 optimized</span>{"\n"}
                    <span className="text-[#F472B6]">def</span> <span className="text-[#60A5FA]">setup_environment</span>():{"\n"}
                    {"    "}print(<span className="text-[#34D399]">"[INFO] Updating DNF and installing Ollama..."</span>){"\n"}
                    {"    "}os.system(<span className="text-[#34D399]">"sudo dnf install -y dnf-plugins-core"</span>){"\n\n"}
                    {"    "}<span className="text-[#64748B]"># Configuring for RTX 4080 CUDA acceleration</span>{"\n"}
                    {"    "}os.environ[<span className="text-[#34D399]">"OLLAMA_CUDA_VERSION"</span>] = <span className="text-[#34D399]">"12.4"</span>{"\n\n"}
                    {"    "}<span className="text-[#64748B]"># Fetching Gemma 4 Instruct model</span>{"\n"}
                    {"    "}print(<span className="text-[#34D399]">"[INFO] Pulling Gemma 4 optimized weights..."</span>){"\n"}
                    {"    "}subprocess.run([<span className="text-[#34D399]">"ollama"</span>, <span className="text-[#34D399]">"run"</span>, <span className="text-[#34D399]">"gemma-4-8b"</span>]){"\n\n"}
                    <span className="text-[#F472B6]">if</span> __name__ == <span className="text-[#34D399]">"__main__"</span>:{"\n"}
                    {"    "}setup_environment()
                  </pre>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-6">
                   <div className="p-5 border border-border/50 rounded-lg">
                      <div className="text-[10px] font-mono text-accent mb-2">01_AUDIT</div>
                      <p className="text-xs text-text-dim">Analyzes local Fedora environment for driver version alignment.</p>
                   </div>
                   <div className="p-5 border border-border/50 rounded-lg">
                      <div className="text-[10px] font-mono text-accent mb-2">02_PROVISION</div>
                      <p className="text-xs text-text-dim">Downloads model weights with verified checksums via Ollama API.</p>
                   </div>
                   <div className="p-5 border border-border/50 rounded-lg">
                      <div className="text-[10px] font-mono text-accent mb-2">03_LOCK</div>
                      <p className="text-xs text-text-dim">Applies memory-lock policy to prevent OOM errors on large context windows.</p>
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
                <div className="mb-8">
                  <h3 className="text-2xl font-bold">Hardware Transparency</h3>
                  <p className="text-xs text-text-dim mt-1">Real-time local cluster monitoring</p>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                   <div className="sleek-card p-6 flex flex-col">
                     <h4 className="sidebar-section-title mb-6">Parallel Allocation</h4>
                     <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={resourceData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'monospace' }} 
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {resourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#38BDF8" fillOpacity={1 - (index * 0.2)} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                     </div>
                   </div>
                   <div className="space-y-6">
                      <div className="sleek-card p-6">
                         <h4 className="sidebar-section-title mb-4">Core System Health</h4>
                         <div className="space-y-4">
                            {[
                              { l: 'Kernel Threading', v: 'OPTIMAL' },
                              { l: 'AVX-512 Support', v: 'ACTIVE' },
                              { l: 'Numa Balancing', v: 'ENABLED' },
                              { l: 'LLM Paging', v: 'SECURE' },
                            ].map(s => (
                              <div key={s.l} className="flex justify-between border-b border-border/30 pb-2">
                                <span className="text-[10px] font-mono uppercase text-text-dim">{s.l}</span>
                                <span className="text-[10px] font-mono text-accent">{s.v}</span>
                              </div>
                            ))}
                          </div>
                      </div>
                      <div className="sleek-card p-6 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] text-text-dim uppercase font-mono">Process Uptime</p>
                            <p className="text-xl font-mono mt-1">04:22:15:34</p>
                         </div>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                            SYS_STABLE
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Rail */}
      <footer className="h-10 bg-surface border-t border-border flex items-center px-8 justify-between z-10">
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-mono uppercase text-text-dim flex items-center gap-2">
            SERVER: LOCALHOST:3000
          </span>
          <span className="text-[9px] font-mono uppercase text-text-dim/40">OLLAMA_PROTO v0.52</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase text-text-dim/60 italic">
          Forge Secure Protocol Active
        </div>
      </footer>
    </div>

  );
}

