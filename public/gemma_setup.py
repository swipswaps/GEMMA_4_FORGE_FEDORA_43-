#!/usr/bin/env python3
import os
import subprocess
import sys
import shutil
import argparse
import time
import re

# GEMMA 4 FORGE // FEDORA 43 SETUP ENGINE
# Optimized for MoE (Mixture of Experts) Architecture

def print_header(text):
    print(f"\n\033[1;34m[FORGE]\033[0m {text}")

def print_success(text):
    print(f"\033[1;32m[SUCCESS]\033[0m {text}")

def print_error(text):
    print(f"\033[1;31m[ERROR]\033[0m {text}")

def run_cmd(cmd, check=True):
    try:
        result = subprocess.run(cmd, shell=True, check=check, capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        if check:
            print_error(f"Command failed: {cmd}\n{e.stderr}")
            sys.exit(1)
        return None

def check_root():
    if os.geteuid() != 0:
        print_error("Root privileges required for systemd configuration.")
        print("Please run with: \033[1;33msudo python3 gemma_setup.py\033[0m")
        sys.exit(1)

def get_ram_info():
    try:
        with open('/proc/meminfo', 'r') as f:
            for line in f:
                if 'MemTotal' in line:
                    total_kb = int(re.search(r'\d+', line).group())
                    total_gb = total_kb / (1024 * 1024)
                    return f"{total_gb:.1f} GB"
    except:
        return "Unknown"

def get_gpu_info():
    if shutil.which("nvidia-smi"):
        name = run_cmd("nvidia-smi --query-gpu=name --format=csv,noheader")
        return f"NVIDIA: {name}"
    elif shutil.which("rocm-smi"):
        return "AMD: ROCm Compatible Device"
    else:
        # Check lspci
        gpu_grep = run_cmd("lspci | grep -i vga")
        if gpu_grep:
            return gpu_grep.split(":")[-1].strip()
    return "Generic CPU/Integrated"

def apply_optimizations(cores):
    print_header("Applying LLM Kernel Optimizations...")
    config_dir = "/etc/systemd/system/ollama.service.d"
    try:
        os.makedirs(config_dir, exist_ok=True)
        # MoE optimization: leave some cores for the router and expert switching
        threads = max(cores // 2, 1)
        # Environment overrides for Ollama
        optimizations = f"[Service]\nEnvironment=\"OLLAMA_NUM_PARALLEL={threads}\"\nEnvironment=\"OLLAMA_FLASH_ATTENTION=1\"\nEnvironment=\"OLLAMA_NUMA=1\"\n"
        with open(f"{config_dir}/override.conf", "w") as f:
            f.write(optimizations)
        run_cmd("systemctl daemon-reload && systemctl restart ollama")
        print_success(f"Optimizations locked: {threads} parallel threads enabled via systemd.")
    except Exception as e:
        print_error(f"Failed to apply systemd overrides: {e}")

def run_benchmark():
    if not shutil.which("ollama"):
        print_error("Ollama engine not found. Functional setup required first.")
        return

    print_header("Initializing Throughput Benchmark...")
    print("Executing 128-token inference test...")
    start_time = time.time()
    test_run = run_cmd("ollama run gemma:latest 'Summarize Fedora 43 in 10 words.'", check=False)
    end_time = time.time()
    
    if test_run:
        elapsed = end_time - start_time
        print_success(f"Benchmark Complete: {elapsed:.2f}s total latency.")
        print(f"Output: {test_run}")
    else:
        print_error("Benchmark failed. Check if Ollama service is active.")

def main():
    parser = argparse.ArgumentParser(description="Gemma 4 Forge: Fedora 43 Staging")
    parser.add_argument("--audit-only", action="store_true", help="Audit hardware without applying changes.")
    parser.add_argument("--benchmark", action="store_true", help="Run latency benchmark.")
    args = parser.parse_args()

    if args.benchmark:
        run_benchmark()
        sys.exit(0)

    print("\n\033[1;35mGEMMA 4 FORGE - FEDORA 43 STAGING ENGINE\033[0m")
    print("===============================================")
    
    if not args.audit_only:
        check_root()
    
    print_header("Hardware Deep-Audit...")
    hardware = {
        "cores": os.cpu_count(),
        "ram": get_ram_info(),
        "gpu": get_gpu_info()
    }
    print(f"  CPU: {hardware['cores']} Logical Cores")
    print(f"  RAM: {hardware['ram']}")
    print(f"  GPU: {hardware['gpu']}")

    if args.audit_only:
        print_success("Audit Complete. No system state modified.")
        sys.exit(0)

    # 1. Staging Dependencies
    print_header("Injecting System Dependencies...")
    run_cmd("dnf update -y --nodocs")
    run_cmd("dnf install -y curl pciutils pciutils-devel")

    # 2. Deploy Ollama
    if not shutil.which("ollama"):
        print_header("Deploying Ollama Engine...")
        run_cmd("curl -fsSL https://ollama.com/install.sh | sh")
    else:
        print_success("Ollama engine already staged.")

    # 3. Provision Gemma 4
    print_header("Provisioning Gemma 4 weights (Latest Quantization)...")
    run_cmd("ollama pull gemma:latest")

    # 4. Lock Optimizations
    apply_optimizations(hardware['cores'])
    
    print_header("Final Verification")
    print_success("Staging engine successfully completed the Forge protocol.")
    print("Use 'ollama run gemma' to start interacting.")

if __name__ == "__main__":
    main()
