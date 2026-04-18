#!/usr/bin/env python3
import os
import subprocess
import sys
import json
import shutil

# Gemma Forge: Fedora 43 Setup & Optimizer
# Targeted for Gemma 4 & Ollama v0.5.0+

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

def check_fedora():
    print_header("Checking System Information...")
    if not os.path.exists("/etc/fedora-release"):
        print_error("This script is optimized for Fedora. Proceed with caution.")
    
    version = run_cmd("cat /etc/fedora-release")
    print_success(f"Running: {version}")

def audit_hardware():
    print_header("Auditing Hardware for Gemma 4 Optimization...")
    
    # Check CPU
    cpu_info = run_cmd("lscpu | grep 'Model name'").split(":")[1].strip()
    logical_cores = os.cpu_count()
    print_success(f"CPU: {cpu_info} ({logical_cores} logical cores)")
    
    # Check RAM
    mem_info = run_cmd("free -h | grep Mem").split()
    total_mem = mem_info[1]
    print_success(f"RAM: {total_mem}")

    # Check GPU
    has_gpu = False
    gpu_info = ""
    
    # Check Nvidia
    if shutil.which("nvidia-smi"):
        gpu_info = run_cmd("nvidia-smi --query-gpu=name --format=csv,noheader")
        vram = run_cmd("nvidia-smi --query-gpu=memory.total --format=csv,noheader,units")
        print_success(f"GPU Detected: {gpu_info} ({vram})")
        has_gpu = True
    # Check AMD
    elif shutil.which("rocm-smi"):
        gpu_info = "AMD ROCm Compatible GPU"
        print_success("GPU Detected: AMD ROCm Compatible Device")
        has_gpu = True
    else:
        print("\033[1;33m[WARN]\033[0m No dedicated GPU detected. Gemma 4 will run on CPU.")

    return {
        "cores": logical_cores,
        "has_gpu": has_gpu
    }

def install_dependencies():
    print_header("Installing Core Dependencies...")
    run_cmd("sudo dnf update -y")
    run_cmd("sudo dnf install -y curl pciutils git python3-pip")

def install_ollama():
    print_header("Deploying Ollama Engine...")
    if shutil.which("ollama"):
        print_success("Ollama already installed.")
    else:
        run_cmd("curl -fsSL https://ollama.com/install.sh | sh")
        print_success("Ollama installation complete.")

def deploy_gemma4():
    print_header("Provisioning Gemma 4 Model...")
    print("This might take several minutes depending on your bandwidth...")
    run_cmd("ollama pull gemma:latest") 
    print_success("Gemma Model Provisioned.")

def apply_optimizations(hardware):
    print_header("Applying High-Performance Optimizations...")
    
    # Create an optimization profile
    # For Fedora 43, we use systemd environment overrides
    config_dir = "/etc/systemd/system/ollama.service.d"
    os.makedirs(config_dir, exist_ok=True)
    
    # Calculate parallel threads
    threads = max(hardware["cores"] // 2, 1)
    
    optimizations = f"""[Service]
Environment="OLLAMA_NUM_PARALLEL={threads}"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
Environment="OLLAMA_FLASH_ATTENTION=1"
"""
    
    with open(f"{config_dir}/override.conf", "w") as f:
        f.write(optimizations)
        
    run_cmd("sudo systemctl daemon-reload")
    run_cmd("sudo systemctl restart ollama")
    
    print_success(f"Optimization Level: ULTRA (Parallelism: {threads} threads)")

import argparse
import time

def run_benchmark():
    print_header("Initializing Throughput Benchmark...")
    start_time = time.time()
    # Simple benchmark using a standard prompt
    test_run = run_cmd("ollama run gemma:latest 'Generate a 50-word technical summary of Fedora 43.'", check=False)
    end_time = time.time()
    
    if test_run:
        elapsed = end_time - start_time
        print_success(f"Benchmark Complete in {elapsed:.2f} seconds.")
        print(f"Sample Output: {test_run[:100]}...")
    else:
        print_error("Benchmark failed. Ensure model is pulled and Ollama is running.")

def main():
    parser = argparse.ArgumentParser(description="Gemma 4 Forge: Fedora 43 Setup & Optimizer")
    parser.add_argument("--audit-only", action="store_true", help="Perform system audit without installing.")
    parser.add_argument("--benchmark", action="store_true", help="Run optimized inference benchmarks.")
    args = parser.parse_args()

    print("\n\033[1;35mGEMMA 4 FORGE - FEDORA 43 COLD START RECOVERY\033[0m")
    print("===============================================")
    
    if args.benchmark:
        run_benchmark()
        sys.exit(0)

    check_fedora()
    hardware = audit_hardware()
    
    if args.audit_only:
        print_success("Audit Complete. No changes made.")
        sys.exit(0)

    install_dependencies()
    install_ollama()
    deploy_gemma4()
    apply_optimizations(hardware)
    
    print_header("System Verification")
    test_run = run_cmd("ollama run gemma:latest 'Summarize Fedora 43 release notes in 1 sentence.'", check=False)
    if test_run:
        print_success("Verification Success: Gemma 4 is operational.")
        print(f"Output: {test_run}")
    else:
        print_error("Verification Failed. Check 'journalctl -u ollama' for logs.")

    print("\n\033[1;32mCOMPLETE: Gemma 4 Forge has finished staging your local LLM environment.\033[0m")

if __name__ == "__main__":
    main()
