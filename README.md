# echoserver

[echoserver](https://echoserver.dev) is a simple echo server for testing HTTP clients.

It generates a URL that returns the exact response you configured.

If you need a temporary server for prototyping or mocking, use this tool.

## Run Locally 💻

```:bash
docker run -it --init --rm -p 5678:5678 yoshipy/echoserver
```

## Features 🎉

- No need to install packages
- Configurable status code
- Headers can be set as you like
- Any text can be set to the body
- A resizable image can be set to the body
- CORS support

## Try it online 👋

Visit <https://echoserver.dev>
