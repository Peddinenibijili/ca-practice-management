# Docker build fix

The reported failure was caused by `npm ci` reading an existing `package-lock.json`
whose dependency tree did not match `package.json`. The log explicitly shows
bcryptjs, dotenv, express and many transitive dependencies out of sync.

This package now uses `npm install` during the Docker build, plus `.dockerignore`
files to prevent local node_modules/build artifacts from being copied.

From the project folder run:

docker compose down -v
docker compose build --no-cache
docker compose up

If Docker still uses an old context, make sure you run the command from the
extracted project root containing this docker-compose.yml.
