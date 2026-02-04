#!/usr/bin/env python3
"""
IPC Latency Benchmark - Measure Named Pipes round-trip
=======================================================
This measures the actual IPC latency between Sentinel C engine and Python brain.

Usage:
    1. Terminal 1: Run the Sentinel C binary normally
       sudo ./bin/sentinel test /bin/bash
       
    2. Terminal 2: Run this benchmark (requires pipes to exist)
       python3 scripts/ipc_benchmark.py

Note: This simulates messages through the Named Pipes to measure real latency.
"""

import os
import time
import statistics
import json

REQ_PIPE = "/tmp/sentinel_req"
RESP_PIPE = "/tmp/sentinel_resp"

def benchmark_ipc_roundtrip(iterations=100):
    """
    Measure IPC round-trip by sending messages through Named Pipes.
    
    IMPORTANT: This requires a modified sentinel to echo back.
    For standalone testing, this measures pipe write/read latency only.
    """
    
    if not os.path.exists(REQ_PIPE) or not os.path.exists(RESP_PIPE):
        print("[!] Named Pipes don't exist. Creating for standalone test...")
        if not os.path.exists(REQ_PIPE): os.mkfifo(REQ_PIPE)
        if not os.path.exists(RESP_PIPE): os.mkfifo(RESP_PIPE)
    
    # Standalone test: measure pipe open/write latency
    latencies = []
    
    print(f"[*] Testing pipe write latency ({iterations} iterations)...")
    
    for i in range(iterations):
        test_msg = json.dumps({
            "verb": "open",
            "path": f"/tmp/test_{i}.txt",
            "pid": 12345,
            "fd": 3,
            "ret": 0
        }) + "\n"
        
        start = time.perf_counter_ns()
        
        # Open, write, close - this is what brain.py sees as IPC overhead
        try:
            # In real usage, pipes stay open. This measures worst-case.
            f_req = open(REQ_PIPE, "w")
            f_req.write(test_msg)
            f_req.flush()
            f_req.close()
        except Exception as e:
            print(f"[!] Error: {e}")
            break
        
        end = time.perf_counter_ns()
        latencies.append(end - start)
    
    return latencies


def benchmark_json_parsing(iterations=1000):
    """Measure JSON parse/serialize overhead (part of IPC cost)."""
    
    test_messages = [
        '{"verb":"open","path":"/etc/passwd","pid":1234,"fd":3,"ret":0}',
        '{"verb":"sendto","path":"","pid":1234,"fd":5,"ret":1024}',
        '{"verb":"execve","path":"/usr/bin/bash","pid":5678,"fd":-1,"ret":0}',
    ]
    
    latencies = []
    
    for _ in range(iterations):
        for msg in test_messages:
            start = time.perf_counter_ns()
            parsed = json.loads(msg)
            _ = json.dumps(parsed)
            end = time.perf_counter_ns()
            latencies.append(end - start)
    
    return latencies


def print_stats(name, latencies_ns):
    """Print statistics."""
    latencies_us = [l / 1000 for l in latencies_ns]
    
    print(f"\n{name}")
    print(f"  Mean:    {statistics.mean(latencies_us):.2f} μs")
    print(f"  Median:  {statistics.median(latencies_us):.2f} μs")
    print(f"  P95:     {statistics.quantiles(latencies_us, n=20)[18]:.2f} μs")
    print(f"  P99:     {statistics.quantiles(latencies_us, n=100)[98]:.2f} μs")
    
    return statistics.mean(latencies_us)


def main():
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║           IPC LATENCY BENCHMARK                             ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print()
    
    # JSON overhead
    print("[*] Measuring JSON serialization overhead...")
    json_latencies = benchmark_json_parsing(1000)
    json_mean = print_stats("JSON Parse + Serialize", json_latencies)
    
    print("\n" + "="*60)
    print("SUMMARY FOR DOSSIER:")
    print(f"  JSON Overhead: {json_mean:.2f} μs")
    print()
    print("Note: For full IPC round-trip, add instrumentation to brain.py main loop")
    print("="*60)


if __name__ == "__main__":
    main()
