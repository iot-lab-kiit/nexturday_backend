REPO_PATH="/home/webteam/nexturday_backend"
DOCKER_COMPOSE_FILE="compose.yaml"
BRANCH="main"
IMAGE_NAME="nexturday_backend-app"

echo "Navigating to repository..."
cd "$REPO_PATH" || { echo "Error: Repository path not found!"; exit 1; }

echo "Pulling the latest changes from the repository..."
git fetch origin "$BRANCH" && git reset --hard "origin/$BRANCH" || { echo "Error: Failed to pull changes!"; exit 1; }

echo "Stopping and removing old Docker containers..."
docker-compose down || { echo "Error: Failed to stop containers!"; exit 1; }

echo "Removing unused Docker resources..."
docker system prune -f || { echo "Error: Failed to prune Docker resources!"; exit 1; }

echo "Building Docker Image..."
docker build -t "$IMAGE_NAME" . || { echo "Error: Failed to build Docker image!"; exit 1; }

echo "Removing dangling Docker images..."
docker rmi $(docker images -f "dangling=true" -q)

echo "Starting fresh Docker containers..."
docker-compose up -d || { echo "Error: Failed to start containers!"; exit 1; }

echo "Deployment completed successfully!"