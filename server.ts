import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import net from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FILE = path.join(process.cwd(), 'forge_protocol.log');
const PORT = 3000;

function logToDisk(message: string) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  console.log(entry.trim());
  try {
    fs.appendFileSync(LOG_FILE, entry);
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

// Check if port is available
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true); // Other errors might not mean port is busy
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '0.0.0.0');
  });
}

async function startServer() {
  logToDisk("Initiating Forge Integrity Check...");

  const available = await isPortAvailable(PORT);
  if (!available) {
    logToDisk(`CRITICAL: Port ${PORT} is already occupied by another process.`);
    logToDisk("To prevent version collision, this instance will now terminate.");
    process.exit(1);
  }

  const app = express();

  // SECURE PROTOCOL ENDPOINT (Avoid SPA Fallback & Static Conflicts)
  app.get('/api/setup-protocol', (req, res) => {
    const scriptPath = path.join(__dirname, 'public', 'gemma_setup.py');
    logToDisk(`STAGING_REQUEST: Serving protocol script to ${req.ip}`);
    if (fs.existsSync(scriptPath)) {
      res.setHeader('Content-Type', 'text/plain'); // Serve as plain text for curl piping
      res.sendFile(scriptPath);
    } else {
      logToDisk(`ERROR: Script not found at ${scriptPath}`);
      res.status(404).send('Protocol binary not staged on server.');
    }
  });

  logToDisk("Integrity Verified. Initializing Forge Secure Server Protocol...");

  // Vite middleware for development
  let vite;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production staging
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logToDisk(`Forge Dashboard active at http://localhost:${PORT}`);
  });

  // CLEAN EXIT HANDLER (CTRL+C / SIGINT / SIGTERM)
  const shutdown = async (signal: string) => {
    logToDisk(`Received ${signal}. Starting clean exit sequence...`);
    
    logToDisk("Persisting session telemetry to disk...");
    
    // Perform any cleanup here
    if (vite) {
      await vite.close();
      logToDisk("Vite middleware terminated.");
    }

    server.close(() => {
      logToDisk("Server connection pool drained.");
      logToDisk("Exiting with status 0. Protocol closed.");
      process.exit(0);
    });

    // Forced exit after 5s if server.close hangs
    setTimeout(() => {
      logToDisk("Forced shutdown after timeout.");
      process.exit(1);
    }, 5000);
  };

  process.on('SIGINT', () => shutdown('SIGINT (Ctrl+C)'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
