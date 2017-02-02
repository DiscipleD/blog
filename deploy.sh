# git operation
git reset HEAD --hard
git fetch
git pull

# TAG_NAME used to set docker image tag
export TAG_NAME=`git tag -l | sort -r | head -n 1`

# docker operation
docker-compose down --volumes

docker-compose up --build -d
