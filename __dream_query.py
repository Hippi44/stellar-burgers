import sqlite3
import json
import datetime

conn = sqlite3.connect(r'C:\Users\Hippi\.local\share\mimocode\mimocode.db')
cursor = conn.cursor()

PROJECT_ID = 'c714b7d5-f8bd-4a76-9863-c6c9fbd105d5'

def fmt_ts(ts):
    try:
        if ts and ts > 1000000000:
            return datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        return str(ts)
    except:
        return str(ts)

print("=== ALL SESSIONS for this project (newest first) ===")
cursor.execute("""
    SELECT id, title, time_created, time_updated
    FROM session
    WHERE project_id = ?
    ORDER BY time_created DESC
""", (PROJECT_ID,))
sessions = cursor.fetchall()
for row in sessions:
    print(f"  {row[0]} | {row[1]} | created={fmt_ts(row[2])} | updated={fmt_ts(row[3])}")

print("\n=== TASKS for project sessions ===")
for s in sessions:
    sid = s[0]
    cursor.execute("""
        SELECT id, status, summary, created_at, last_event_at
        FROM task
        WHERE session_id = ?
        ORDER BY created_at
    """, (sid,))
    tasks = cursor.fetchall()
    if tasks:
        print(f"\n  Session: {sid} ({s[1]})")
        for t in tasks:
            print(f"    Task {t[0]}: status={t[1]} summary={t[2][:100]}")

print("\n=== ACTOR REGISTRY for project sessions ===")
for s in sessions:
    sid = s[0]
    cursor.execute("""
        SELECT actor_id, mode, agent, description, status, turn_count, last_outcome
        FROM actor_registry
        WHERE session_id = ?
    """, (sid,))
    actors = cursor.fetchall()
    if actors:
        print(f"\n  Session: {sid}")
        for a in actors:
            print(f"    Actor {a[0]}: mode={a[1]} agent={a[2]} desc={a[3][:80]} status={a[4]} turns={a[5]} outcome={a[6]}")

conn.close()
