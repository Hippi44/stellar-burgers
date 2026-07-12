import sqlite3
import json
import datetime

conn = sqlite3.connect(r'C:\Users\Hippi\.local\share\mimocode\mimocode.db')
cursor = conn.cursor()

# Get actual message content from the active working session
SESSION_ID = 'ses_0a9db0b8cffe5dWss1qH5LqLpe'

# Get last 5 assistant messages text
print("=== Last assistant text messages ===")
cursor.execute("""
    SELECT m.id, m.time_created, p.data
    FROM message m
    JOIN part p ON p.message_id = m.id
    WHERE m.session_id = ?
      AND json_extract(m.data, '$.role') = 'assistant'
    ORDER BY m.time_created DESC, p.time_created DESC
    LIMIT 15
""", (SESSION_ID,))
rows = cursor.fetchall()
for row in rows:
    msg_id, time_created, part_data = row
    d = json.loads(part_data)
    if d.get('type') == 'text':
        text = d.get('text', '')
        if text.strip():
            ts = datetime.datetime.fromtimestamp(time_created/1000, tz=datetime.timezone.utc).strftime('%H:%M:%S')
            print(f"\n  ASSISTANT TEXT at {ts}:")
            print(f"    {text[:500]}")
            break
    elif d.get('type') == 'tool':
        tool = d.get('tool', '?')
        state = d.get('state', {})
        inp = str(state.get('input', ''))[:200]
        print(f"  tool={tool} input={inp}")

# Now let's look at task progress files from the two main sessions
conn.close()

# Check task directories
import os

print("\n\n=== Task progress files from ses_0d2e9766 ===")
tasks_dir = r'C:\Users\Hippi\.local\share\mimocode\memory\sessions\ses_0d2e97661ffeV30ceNHD95sKAt\tasks'
if os.path.isdir(tasks_dir):
    for d in os.listdir(tasks_dir):
        fp = os.path.join(tasks_dir, d, 'progress.md')
        if os.path.isfile(fp):
            print(f"\n  {d}/progress.md:")
            with open(fp, 'r', encoding='utf-8') as f:
                print(f"    {f.read()[:500]}")

print("\n\n=== Task progress files from ses_0d8d66ca ===")
tasks_dir2 = r'C:\Users\Hippi\.local\share\mimocode\memory\sessions\ses_0d8d66ca6ffeWgUFDCfQVW5bI5\tasks'
if os.path.isdir(tasks_dir2):
    for d in os.listdir(tasks_dir2):
        fp = os.path.join(tasks_dir2, d, 'progress.md')
        if os.path.isfile(fp):
            print(f"\n  {d}/progress.md:")
            with open(fp, 'r', encoding='utf-8') as f:
                print(f"    {f.read()[:500]}")
