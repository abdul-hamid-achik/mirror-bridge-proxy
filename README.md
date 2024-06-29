# Mirror Bridge Proxy

Mirror Bridge Proxy is a Fastify-based proxy server that forwards requests to a target server and applies various policies such as CORS, JWT decoding, and header transformation. This project is designed to be easily configurable and extendable.

## Features

- **CORS Policy**: Handles Cross-Origin Resource Sharing (CORS) requests.
- **JWT Decode Policy**: Decodes JWT tokens and extracts user information.
- **Header Transform Policy**: Transforms request headers based on configuration.

## Installation

To install dependencies, run:

```bash
bun install
```

## Running the Server

To run the server locally, use:

```bash
bun run src/index.ts
```

## Configuration

The server configuration is managed through YAML files. The default configuration file is located at `config/default.yaml`. You can specify a different configuration file by setting the `CONFIG_FILE` environment variable.

Example configuration (`config/default.yaml`):

```yaml
sourcePort: 3000
targetUrl: 'http://localhost:8081'
policies:
  - name: Cors
    config:
      origin: 'http://localhost:3000'
      methods:
        - GET
        - POST
        - PUT
        - DELETE
      credentials: true
  - name: JwtDecode
    config:
      headerName: 'Authorization'
      userIdKey: 'sub'
  - name: HeaderTransform
    config:
      'X-Forwarded-User': '${x-user-id}'
      'X-Custom-Header': 'CustomValue'
```

## Running with Docker

To run the server using Docker, you can use the pre-built Docker image `abdulachik/mirror-bridge-proxy`. The Docker image is configured to use the `config/default.yaml` file by default.

### Docker Compose

You can use Docker Compose to run the server along with any dependent services. Here's an example `docker-compose.yml` file:

```yaml
version: "3"
services:
  mirror-bridge-proxy:
    image: abdulachik/mirror-bridge-proxy
    ports:
      - "3000:3000"
    volumes:
      - ./config:/app/config
    environment:
      CONFIG_FILE: /app/config/default.yaml
    depends_on:
      - my-app
  my-app:
    image: my-app-image
    ports:
      - "8081:8081"
```

This will start the `mirror-bridge-proxy` service and any dependent services defined in the `docker-compose.yml` file.

## Testing

To run the tests, use:

```bash
bun run test
```

The tests are written using Jest and are located in the `test` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any questions or support, please open an issue in the GitHub repository.
