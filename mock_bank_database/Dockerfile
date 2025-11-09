FROM mysql

# Copy your init SQL into the standard init directory
# (Runs only on the first boot of a fresh data volume)
COPY createDB.sql /docker-entrypoint-initdb.d/

# Optional: set a safe default TZ to avoid weirdness
ENV TZ=UTC
