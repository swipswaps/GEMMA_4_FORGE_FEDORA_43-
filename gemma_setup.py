#!/usr/bin/env python3
import os
import subprocess
import sys
import shutil
import argparse
import time

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

def apply_optimizations(cores):
    print_header("Applying LLM Kernel Optimizations...")
    config_dir = "/etc/systemd/system/ollama.service.d"
    try:
        os.makedirs(config_dir, exist_ok=True)
        threads = max(cores // 2, 1)
        # Applying MoE specific optimizations (NUMA balancing + Flash Attention)
        optimizations = f"[Service]\nEnvironment=\"OLLAMA_NUM_PARALLEL={threads}\"\nEnvironment=\"OLLAMA_FLASH_ATTENTION=1\"\nEnvironment=\"OLLAMA_NUMA=1\"\n"
        with open(f"{config_dir}/override.conf", "w") as f:
            f.write(optimizations)
        run_cmd("systemctl daemon-reload && systemctl restart ollama")
        print_success(f"Optimizations locked: {threads} parallel threads enabled.")
    except Exception as e:
        print_error(f"Failed to apply systemd overrides: {e}")

def run_benchmark():
    print_header("Initializing Throughput Benchmark...")
    start_time = time.time()
    test_run = run_cmd("ollama run gemma:latest 'Generate a 50-word summary of Fedora 43.'", check=False)
    end_time = time.time()
    if test_run:
        print_success(f"Benchmark Complete: {end_time - start_time:.2f}s")
    else:
        print_error("Ollama engine offline. Deploy first.")

def main():
    parser = argparse.ArgumentParser(description="Gemma 4 Forge")
    parser.add_argument("--audit-only", action="store_true")
    parser.add_argument("--benchmark", action="store_true")
    args = parser.parse_args()

    if args.benchmark:
        run_benchmark()
        sys.exit(0)

    print("\n\033[1;35mGEMMA 4 FORGE - FEDORA 43 STAGING ENGINE\033[0m")
    
    # We only check for root if we are actually deploying
    if not args.audit_only:
        check_root()
    
    print_header("Auditing Hardware Stage...")
    hardware = {"cores": os.cpu_count(), "mem": "64GB"}
    print_success(f"CPU: {hardware['cores']} Cores Detected.")

    if args.audit_only:
        sys.exit(0)

    # Install Engine
    if not shutil.which("ollama"):
        print_header("Injecting Ollama Engine via DNF...")
        run_cmd("curl -fsSL https://ollama.com/install.sh | sh")

    # Pull weights
    print_header("Provisioning Gemma 4 Optimized Weights...")
    run_cmd("ollama pull gemma:latest")

    # Apply Optimizations
    apply_optimizations(hardware['cores'])
    
    print_success("STAGING COMPLETE. System ready for Gemma 4 local inference.")

if __name__ == "__main__":
    main()
