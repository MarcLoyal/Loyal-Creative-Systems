#!/usr/bin/env bash
# Starts a throwaway local Postgres 16 for the database tests (no Docker, no Supabase CLI).
#   scripts/local-postgres.sh start   → prints the TEST_DATABASE_URL to export
#   scripts/local-postgres.sh stop
# CI uses a postgres service container instead (see .github/workflows/ci.yml).
set -euo pipefail

PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
DATA="${PGDATA_DIR:-${TMPDIR:-/tmp}/lcs-pg-data}"
PORT="${PGPORT:-54329}"
RUN_AS=()
if [ "$(id -u)" = "0" ]; then RUN_AS=(runuser -u postgres --); fi

case "${1:-start}" in
  start)
    if [ ! -f "$DATA/PG_VERSION" ]; then
      mkdir -p "$DATA"
      [ "$(id -u)" = "0" ] && chown postgres "$DATA"
      "${RUN_AS[@]}" "$PGBIN/initdb" -D "$DATA" -U postgres --auth=trust -E UTF8 >/dev/null
    fi
    if ! "${RUN_AS[@]}" "$PGBIN/pg_ctl" -D "$DATA" status >/dev/null 2>&1; then
      "${RUN_AS[@]}" "$PGBIN/pg_ctl" -D "$DATA" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$DATA/log" -w start >/dev/null
    fi
    echo "postgres://postgres@localhost:$PORT/postgres"
    ;;
  stop)
    "${RUN_AS[@]}" "$PGBIN/pg_ctl" -D "$DATA" -m fast stop
    ;;
  *)
    echo "usage: $0 start|stop" >&2
    exit 1
    ;;
esac
