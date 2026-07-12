import sqlite3
import json
import datetime

conn = sqlite3.connect(r'C:\Users\Hippi\.local\share\mimocode\mimocode.db')
cursor = conn.cursor()

# Check the most recent active session: ses_0a9db0b8cffe5dWss1qH5LqLpe
# This is "Внедрение правок из tz.md с проверкой по чек-листу"
SESSION_ID = 'ses_0a9db0b8cffe5dWss1qH5LqLpe'

print("=== Messages for active session ===")
cursor.execute("""
    SELECT m.id, m.agent_id, m.time_created, json_extract(m.data, '$.role') as role,
           substr(m.data, 1, 300) as preview
    FROM message m
    WHERE m.session_id = ?
    ORDER BY m.time_created
""", (SESSION_ID,))
msgs = cursor.fetchall()
for m in msgs:
    ts = datetime.datetime.fromtimestamp(m[2]/1000, tz=datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ') if m[2] > 1000000000000 else str(m[2])
    print(f"  msg {m[0]} | agent={m[1]} | role={m[3]} | time={ts}")
    print(f"    preview: {m[4][:200]}")
    print()

print(f"\nTotal messages: {len(msgs)}")

# Check tasks
cursor.execute("""
    SELECT id, status, summary, created_at
    FROM task
    WHERE session_id = ?
""", (SESSION_ID,))
tasks = cursor.fetchall()
if tasks:
    print("\n=== Tasks ===")
    for t in tasks:
        print(f"  {t[0]}: status={t[1]} summary={t[2][:120]}")
else:
    print("\nNo tasks found")

# Check task events
cursor.execute("""
    SELECT task_id, at, kind, summary
    FROM task_event
    WHERE session_id = ?
    ORDER BY at
""", (SESSION_ID,))
events = cursor.fetchall()
if events:
    print("\n=== Task events ===")
    for e in events:
        print(f"  task={e[0]} kind={e[2]} summary={str(e[3])[:120]}")

conn.close()
