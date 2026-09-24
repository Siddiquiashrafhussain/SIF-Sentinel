import subprocess
import sys
import os

def run_script(script_name):
    print(f"==========================================")
    print(f"Running {script_name}...")
    print(f"==========================================")
    
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    result = subprocess.run([sys.executable, script_path], capture_output=False)
    
    if result.returncode != 0:
        print(f"Error running {script_name}")
        sys.exit(result.returncode)

def main():
    run_script("generate_data.py")
    run_script("train_sif_baseline.py")
    run_script("train_lsr.py")
    run_script("evaluate.py")
    run_script("evaluate_barriers.py")
    run_script("evaluate_clusters.py")
    print("All tasks completed successfully!")

if __name__ == '__main__':
    main()
