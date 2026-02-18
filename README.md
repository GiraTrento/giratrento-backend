# Quick Start guide

1. Clone the project:
    ```bash
    git clone git@github.com:GiraTrento/giratrento-backend.git
    ```
2. Install dependencies:
    ```bash
    cd giratrento-backend
    npm install
    ```
3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/giratrento
    JWT_SECRET=your_jwt_secret
    ```
4. Start MongoDB Docker container:
    ```bash
    docker-compose up -d
    ```
5. Start the server:
    ```bash
    npm start
    ```

The server will be running at `http://localhost:3000`. You can now use the API endpoints to interact with the application.

## To cleanup:

1. Stop the server:
    ```bash
    npm stop
    ```
2. Stop and remove the MongoDB Docker container:
    ```bash
    docker-compose down
    ```
3. Optionally, remove the volume to delete all data:
    ```bash
    docker-compose down -v
    ```
