import sqlite3
import json
import datetime

conn = sqlite3.connect(r'C:\Users\Hippi\.local\share\mimocode\mimocode.db')
cursor = conn.cursor()

SESSION_ID = 'ses_0a9db0b8cffe5dWss1qH5LqLpe'

# Get all text parts from assistant messages
print("=== All assistant text in active session ===")
cursor.execute("""
    SELECT m.time_created, p.data
    FROM message m
    JOIN part p ON p.message_id = m.id
    WHERE m.session_id = ?
      AND json_extract(m.data, '$.role') = 'assistant'
      AND json_extract(p.data, '$.type') = 'text'
    ORDER BY m.time_created, p.time_created
""", (SESSION_ID,))
rows = cursor.fetchall()
for row in rows:
    time_created, part_data = row
    d = json.loads(part_data)
    text = d.get('text', '').strip()
    if text:
        ts = datetime.datetime.fromtimestamp(time_created/1000, tz=datetime.timezone.utc).strftime('%H:%M:%S')
        print(f"\n[{ts}] {text[:1000]}")

print("\n\n=== All tool calls in active session ===")
cursor.execute("""
    SELECT m.time_created, p.data
    FROM message m
    JOIN part p ON p.message_id = m.id
    WHERE m.session_id = ?
      AND json_extract(m.data, '$.role') = 'assistant'
      AND json_extract(p.data, '$.type') = 'tool'
    ORDER BY m.time_created, p.time_created
""", (SESSION_ID,))
rows = cursor.fetchall()
for row in rows:
    time_created, part_data = row
    d = json.loads(part_data)
    tool = d.get('tool', '?')
    state = d.get('state', {})
    inp = state.get('input', {})
    ts = datetime.datetime.fromtimestamp(time_created/1000, tz=datetime.timezone.utc).strftime('%H:%M:%S')
    if isinstance(inp, dict):
        inp_str = json.dumps(inp, ensure_ascii=False)[:200]
    else:
        inp_str = str(inp)[:200]
    print(f"  [{ts}] {tool}: {inp_str}")

conn.close()
