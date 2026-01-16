# Cloudflare R2 Token Proxy

A Cloudflare Worker that provides token-authenticated access to files stored in Cloudflare R2.

## Features

- Token-based authentication for R2 file access
- Optional URL path prefix filtering
- Path traversal attack protection

## Configure via Cloudflare Dashboard

Navigate to **Workers & Pages → Your Worker → Settings**

### Bindings

Add an R2 Bucket binding:
- Variable name: `R2_BUCKET`
- R2 bucket: Select your bucket

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_TOKEN` | Yes | Secret token for authentication |
| `PATH_PREFIX` | No | URL path prefix (e.g., `/proxy`) |

## Usage

Access files with the token parameter:

```
https://your-worker.workers.dev/path/to/file.yaml?token=YOUR_TOKEN
```

With path prefix configured as `/proxy`:

```
https://your-worker.workers.dev/proxy/path/to/file.yaml?token=YOUR_TOKEN
```

This will fetch `path/to/file.yaml` from your R2 bucket.

## License

MIT
