---
description: Setup local SSL certificates using mkcert.
---

# Setup Local SSL

## 1. Install mkcert

- [ ] Install mkcert tool.

```bash
choco install mkcert
```

## 2. Install CA

- [ ] Install local CA.

```bash
mkcert -install
```

## 3. Generate Certs

- [ ] Generate certs for localhost.

```bash
mkdir -p .certs
mkcert -key-file .certs/key.pem -cert-file .certs/cert.pem localhost 127.0.0.1
```
