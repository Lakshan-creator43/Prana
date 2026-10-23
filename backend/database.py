import sqlite3
import json
from datetime import datetime
from config import Config


def get_db():
    """Get a database connection with row factory."""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Initialize the database schema."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symptoms TEXT NOT NULL,
            risk_level TEXT NOT NULL DEFAULT 'low',
            red_flags TEXT DEFAULT '[]',
            remedies_found INTEGER DEFAULT 0,
            results_json TEXT DEFAULT '[]',
            sources_used TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS saved_remedies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            search_id INTEGER,
            remedy_id TEXT NOT NULL,
            remedy_name TEXT NOT NULL,
            remedy_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (search_id) REFERENCES search_history(id)
        );

        CREATE TABLE IF NOT EXISTS remedy_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cache_key TEXT UNIQUE NOT NULL,
            remedy_json TEXT NOT NULL,
            sources_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS scrape_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL
        );

        CREATE TABLE IF NOT EXISTS remedy_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            remedy_id TEXT NOT NULL,
            parent_id INTEGER DEFAULT NULL,
            author_name TEXT NOT NULL DEFAULT 'Anonymous',
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES remedy_comments(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS research_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            search_id INTEGER,
            rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            helpful TEXT DEFAULT '',
            improve TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (search_id) REFERENCES search_history(id)
        );
    """)

    conn.commit()
    conn.close()
    print("[PRANA DB] Database initialized successfully.")


def save_search(symptoms, risk_level, red_flags, remedies_found, results, sources_used):
    """Save a search to history."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO search_history
           (symptoms, risk_level, red_flags, remedies_found, results_json, sources_used)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (
            symptoms,
            risk_level,
            json.dumps(red_flags),
            remedies_found,
            json.dumps(results),
            json.dumps(sources_used),
        ),
    )
    conn.commit()
    search_id = cursor.lastrowid
    conn.close()
    return search_id


def get_search_history(limit=20):
    """Retrieve search history."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT id, symptoms, risk_level, red_flags, remedies_found,
                  results_json, sources_used, created_at
           FROM search_history
           ORDER BY created_at DESC
           LIMIT ?""",
        (limit,),
    )
    rows = cursor.fetchall()
    conn.close()

    history = []
    for row in rows:
        saved = get_saved_remedies_for_search(row["id"])
        history.append(
            {
                "id": f"h{row['id']}",
                "dbId": row["id"],
                "symptoms": row["symptoms"],
                "date": row["created_at"],
                "riskLevel": row["risk_level"],
                "redFlags": json.loads(row["red_flags"] or "[]"),
                "remediesFound": row["remedies_found"],
                "results": json.loads(row["results_json"] or "[]"),
                "sourcesUsed": json.loads(row["sources_used"] or "[]"),
                "savedRemedies": [s["remedy_id"] for s in saved],
            }
        )
    return history


def save_remedy(search_id, remedy_id, remedy_name, remedy_json):
    """Save a remedy to saved_remedies."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO saved_remedies (search_id, remedy_id, remedy_name, remedy_json)
           VALUES (?, ?, ?, ?)""",
        (search_id, remedy_id, remedy_name, json.dumps(remedy_json)),
    )
    conn.commit()
    conn.close()


def get_saved_remedies_for_search(search_id):
    """Get saved remedies for a specific search."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT remedy_id, remedy_name FROM saved_remedies WHERE search_id = ?",
        (search_id,),
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"remedy_id": r["remedy_id"], "remedy_name": r["remedy_name"]} for r in rows]


def get_all_saved_remedies():
    """Get all saved remedies across all searches."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT sr.id, sr.remedy_id, sr.remedy_name, sr.remedy_json,
                  sr.created_at, sh.symptoms
           FROM saved_remedies sr
           LEFT JOIN search_history sh ON sr.search_id = sh.id
           ORDER BY sr.created_at DESC"""
    )
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "remedyId": row["remedy_id"],
            "remedyName": row["remedy_name"],
            "remedyData": json.loads(row["remedy_json"] or "{}"),
            "savedAt": row["created_at"],
            "symptoms": row["symptoms"] or "",
        })
    return results


def delete_saved_remedy(remedy_db_id):
    """Delete a saved remedy by its database ID."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_remedies WHERE id = ?", (remedy_db_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    return deleted > 0


def get_cached_remedy(cache_key):
    """Get a cached remedy result."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT remedy_json, sources_json FROM remedy_cache
           WHERE cache_key = ? AND expires_at > ?""",
        (cache_key, datetime.utcnow().isoformat()),
    )
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "remedies": json.loads(row["remedy_json"]),
            "sources": json.loads(row["sources_json"]),
        }
    return None


def set_cached_remedy(cache_key, remedies, sources, ttl_hours=24):
    """Cache a remedy result."""
    conn = get_db()
    cursor = conn.cursor()
    expires = datetime.utcnow()
    from datetime import timedelta

    expires = expires + timedelta(hours=ttl_hours)
    cursor.execute(
        """INSERT OR REPLACE INTO remedy_cache (cache_key, remedy_json, sources_json, expires_at)
           VALUES (?, ?, ?, ?)""",
        (cache_key, json.dumps(remedies), json.dumps(sources), expires.isoformat()),
    )
    conn.commit()
    conn.close()


def get_cached_scrape(url):
    """Get cached scrape content."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT content FROM scrape_cache WHERE url = ? AND expires_at > ?",
        (url, datetime.utcnow().isoformat()),
    )
    row = cursor.fetchone()
    conn.close()
    return row["content"] if row else None


def set_cached_scrape(url, content, ttl_hours=12):
    """Cache scraped content."""
    conn = get_db()
    cursor = conn.cursor()
    from datetime import timedelta

    expires = (datetime.utcnow() + timedelta(hours=ttl_hours)).isoformat()
    cursor.execute(
        """INSERT OR REPLACE INTO scrape_cache (url, content, expires_at)
           VALUES (?, ?, ?)""",
        (url, content, expires),
    )
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# Comments
# ──────────────────────────────────────────────

def add_comment(remedy_id, author_name, content, parent_id=None):
    """Add a comment to a remedy."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO remedy_comments (remedy_id, parent_id, author_name, content)
           VALUES (?, ?, ?, ?)""",
        (remedy_id, parent_id, author_name or "Anonymous", content),
    )
    conn.commit()
    comment_id = cursor.lastrowid
    # Fetch the newly created comment to return it
    cursor.execute(
        "SELECT id, remedy_id, parent_id, author_name, content, created_at FROM remedy_comments WHERE id = ?",
        (comment_id,),
    )
    row = cursor.fetchone()
    conn.close()
    return {
        "id": row["id"],
        "remedyId": row["remedy_id"],
        "parentId": row["parent_id"],
        "authorName": row["author_name"],
        "content": row["content"],
        "createdAt": row["created_at"],
        "replies": [],
    }


def get_comments(remedy_id):
    """Get all comments for a remedy, organized as a thread (top-level + replies)."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT id, remedy_id, parent_id, author_name, content, created_at
           FROM remedy_comments
           WHERE remedy_id = ?
           ORDER BY created_at ASC""",
        (remedy_id,),
    )
    rows = cursor.fetchall()
    conn.close()

    comments_map = {}
    top_level = []

    for row in rows:
        comment = {
            "id": row["id"],
            "remedyId": row["remedy_id"],
            "parentId": row["parent_id"],
            "authorName": row["author_name"],
            "content": row["content"],
            "createdAt": row["created_at"],
            "replies": [],
        }
        comments_map[comment["id"]] = comment
        if comment["parentId"] is None:
            top_level.append(comment)
        else:
            parent = comments_map.get(comment["parentId"])
            if parent:
                parent["replies"].append(comment)
            else:
                top_level.append(comment)

    return top_level


def delete_comment(comment_id):
    """Delete a comment by its ID (cascades to replies)."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM remedy_comments WHERE id = ?", (comment_id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()
    return deleted > 0


# ──────────────────────────────────────────────
# Research Feedback
# ──────────────────────────────────────────────

def add_feedback(rating, helpful="", improve="", search_id=None):
    """Save research feedback."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO research_feedback (search_id, rating, helpful, improve)
           VALUES (?, ?, ?, ?)""",
        (search_id, rating, helpful, improve),
    )
    conn.commit()
    feedback_id = cursor.lastrowid
    conn.close()
    return feedback_id


def get_feedback(limit=50):
    """Get recent feedback entries."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT id, search_id, rating, helpful, improve, created_at
           FROM research_feedback
           ORDER BY created_at DESC
           LIMIT ?""",
        (limit,),
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row["id"],
            "searchId": row["search_id"],
            "rating": row["rating"],
            "helpful": row["helpful"],
            "improve": row["improve"],
            "createdAt": row["created_at"],
        }
        for row in rows
    ]

