# GEMMA 4 FORGE // FEDORA 43

Gemma 4 Forge is a high-performance staging and optimization environment for deploying **Gemma 4** (Google's MiXed-of-Experts architecture) locally on **Fedora 43 Workstation**. It combines an elegant technical dashboard for real-time monitoring with a robust system staging script for hardware-level tuning.

---

## 🛡️ Protocol Integrity Features

Forge is built with high-availability and stability as core requirements:

- **EADDRINUSE Detection**: The Forge server performs a pre-flight integrity check. If port 3000 is occupied, it safely terminates to prevent version collision.
- **SIGINT Clean Exit**: Supports graceful termination. Pressing `Ctrl+C` triggers an asynchronous cleanup sequence that persists telemetry logs to `forge_protocol.log` before closing the process.
- **Remote Proto-Exec**: Verified HTTPS-bootstrapped staging enables remote deployment with zero-cloning requirements.

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
Start by cloning the Forge repository to your local Fedora environment:
```bash
git clone https://github.com/your-username/gemma-4-forge.git
cd gemma-4-forge
```

### 2. Install Dashboard Dependencies
The Forge Dashboard provides real-time transparency into your system's resources and performance projections.
```bash
npm install
npm run dev
```
*The dashboard will be available at `http://localhost:3000`.*

---

## 🛠️ System Analysis & Deployment

Gemma 4 Forge utilizes a specialized Python staging engine (`gemma_setup.py`) to prepare your kernel for local LLM inference.

### 1. Perform Hardware Audit
The script automatically audits your CPU architecture (AVX-512 checks), VRAM availability, and Fedora version alignment.
```bash
# Preview the audit logic
python3 gemma_setup.py --audit-only
```

### 2. Full System Staging (Local)
Execute the forge protocol to install the Ollama engine, apply systemd overrides, and pull optimized Gemma 4 weights.
```bash
chmod +x gemma_setup.py
sudo python3 gemma_setup.py
```

### 3. Remote Staging (One-Liner)
If you prefer a direct deployment without cloning, use the verified remote protocol:
```bash
curl -fsSL https://ais-dev-hrocxvrz4rp5j7zwkqhks3-551892114849.us-east1.run.app/gemma_setup.py | sudo python3
```
*(Note: Replace the URL with your actual deployment host provided in the Dashboard's "Execute Installation" modal).*

**What the script does:**
- Injecting the **Ollama v0.5+** binary via DNF5.
- Calculating **Parallelism Overrides** based on your logical core count.
- Enabling **FLASH_ATTENTION** at the service level.
- Provisioning and quantizing **Gemma 4** weights for your specific VRAM ceiling.

---

## 📊 Benchmarking & Verification

Once deployed, use the built-in benchmarking tools to verify your local LLM throughput.

### 1. Functional Test
Verify that the model is responding correctly with optimized pathing:
```bash
ollama run gemma:latest "Explain the benefits of MoE architecture in 2026 AI systems."
```

### 2. Latency Benchmarking
To perform a full stress test and compare "Standard" vs "Optimized" latency (as seen in the Dashboard's Projection Chart):
```bash
# Run a 10-cycle inference benchmark
python3 gemma_setup.py --benchmark
```

### 3. Real-Time Telemetry
Open the **"Performance Audit"** tab in the Dashboard (`http://localhost:3000`) while running inference. You should observe:
- **CPU Load**: Balancing across physical cores.
- **VRAM Usage**: Stable FP16 quantization footprint.
- **Status**: `SYS_STABLE` with green pulse indicators.

---

## 🧪 Advanced Optimization

For users with specific hardware configurations, you can manually adjust the "Forge Controller" settings:

| Parameter | Configuration Path | Impact |
| :--- | :--- | :--- |
| **OLLAMA_NUM_PARALLEL** | `/etc/systemd/system/ollama.service.d/` | Adjusts token-per-second concurrency. |
| **VRAM Memory Lock** | `gemma_setup.py` | Prevents OOM by locking weights in physical memory. |
| **Quantization Level** | Forge Script | Choose between Q4_K_M (Fast) or FP16 (Precise). |

---

## 🆘 Troubleshooting

- **"GPU Not Found"**: Ensure `nvidia-smi` or `rocm-smi` is in your `$PATH`.
- **"OOM (Out of Memory)"**: Try the "VRAM Optimization" toggle in the Dashboard to enable aggressive quantization.
- **"Permission Denied"**: The setup script requires `sudo` to modify systemd service overrides and DNF repositories.

---

**Built for the Local Era.**
*Gemma 4 Forge utilizes verified Fedora 43 pathing and Google's 2026 Gemma architecture.*
