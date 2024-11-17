# valorant_randomizer

This is a fanmade valorant application and is not in any way associated with Riot Games.

https://valomizer.net

## Environment Setup

This application is using docker.
You need to set up docker in your local environment.

Please make sure you got atleast Node.js v21 installed.

I would recommend using Visual Studio Code.

## Setting up local dev environment

1. Install Docker and ensure it is running.
2. Clone the repository to your local machine.
3. Navigate to the project directory.
4. Rename `.env.example` to `.env` and update your variables if needed
5. Create self signed ssl files, move them to `./server/.ssh` and name them `fullchain1.pem` and `privkey1.pem`
6. Create a `.env.local` in `./client/` and set `VITE_APP_API_URL`. It should be something like `http://localhost:1338/api` where 1338 is your backend port.
6. Build and start the containers using Docker Compose:

   ```sh
   docker compose up frontend-dev backend db -d
   ```

7. Open `http://localhost:8081` and start development.
8. Right now there is no hot reloading on backend. Just rebuild container for now.

## Setting up production server

1. Install Docker and ensure it is running.
2. Clone the repository to your server.
3. Navigate to the project directory.
4. Rename `.env.example` to `.env` and update your variables if needed
5. Copy valid ssh files to `./server/.ssh` and name them `fullchain1.pem` and `privkey1.pem`
6. Build and start the containers using Docker Compose:

   ```sh
   docker compose up frontend-prod backend db -d
   ```

## Creating self signed ssl files

Windows:
If you got git installed simply run following command inside `git bash`:

```sh
openssl req -newkey rsa:2048 -nodes -keyout privkey1.pem -x509 -days 365 -out fullchain1.pem
```

## Troubleshooting

If you changed something in your setup and you can't see changes anymore start container with `--build` flag to rebuild the container.

To see container logs run one of the following commands:

```sh
docker logs valorant_randomizer-backend-1 -f

docker logs valorant_randomizer-frontend-1 -f

docker logs valorant_randomizer-db-1 -f
```

