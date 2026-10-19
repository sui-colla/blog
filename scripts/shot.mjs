/**
 * 视觉回归用的无头截图脚本（无第三方依赖）
 *
 * 用法：
 *   node scripts/shot.mjs --url=http://127.0.0.1:3210/ --out=shots/home-light.png --theme=light
 *   node scripts/shot.mjs --url=... --out=... --theme=dark --mobile
 *
 * 通过 Chrome DevTools Protocol 直接控制 headless Chrome：
 * 可模拟 prefers-color-scheme、视口尺寸，并截取整页。
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.length ? rest.join("=") : true];
  })
);

const url = args.url ?? "http://127.0.0.1:3210/";
const out = args.out ?? "shots/shot.png";
const theme = args.theme === "dark" ? "dark" : "light";
const mobile = Boolean(args.mobile);
const width = Number(args.width ?? (mobile ? 390 : 1440));
const height = Number(args.height ?? (mobile ? 844 : 1000));
const chromePath =
  args.chrome ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = Number(args.port ?? 9333);

const profileDir = path.join(process.cwd(), ".shot-profile");
fs.mkdirSync(profileDir, { recursive: true });
fs.mkdirSync(path.dirname(out), { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--hide-scrollbars",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--mute-audio",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--force-device-scale-factor=1",
    "about:blank",
  ],
  { stdio: "ignore", detached: false }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDevtools() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await sleep(250);
  }
  throw new Error("devtools endpoint did not come up");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const listeners = new Map();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    } else if (message.method) {
      const list = listeners.get(message.method) ?? [];
      list.splice(0).forEach((fn) => fn(message.params));
    }
  };

  const ready = new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  return {
    ready,
    send(method, params = {}) {
      nextId += 1;
      const id = nextId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    once(method, timeout = 15000) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error(`${method} timeout`)),
          timeout
        );
        const list = listeners.get(method) ?? [];
        list.push((params) => {
          clearTimeout(timer);
          resolve(params);
        });
        listeners.set(method, list);
      });
    },
    on(method, fn) {
      const list = listeners.get(method) ?? [];
      list.push(fn);
      listeners.set(method, list);
    },
    close() {
      ws.close();
    },
  };
}

const main = async () => {
  await waitForDevtools();
  const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: "PUT",
  });
  const target = await res.json();
  const client = connect(target.webSocketDebuggerUrl);
  await client.ready;

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");

  if (args.log) {
    client.on("Runtime.consoleAPICalled", (params) => {
      console.log(
        "[console]",
        params.type,
        params.args.map((a) => a.value ?? a.description).join(" ")
      );
    });
    client.on("Runtime.exceptionThrown", (params) => {
      console.log(
        "[exception]",
        params.exceptionDetails.text,
        params.exceptionDetails.exception?.description ?? ""
      );
    });
    client.on("Log.entryAdded", (params) => {
      if (params.entry.level === "error" || params.entry.level === "warning") {
        console.log("[log]", params.entry.level, params.entry.text, params.entry.url ?? "");
      }
    });
  }
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await client.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: theme },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });

  const loaded = client.once("Page.loadEventFired");
  await client.send("Page.navigate", { url });
  await loaded;
  await sleep(1400);

  if (args.eval) {
    await client.send("Runtime.evaluate", {
      expression: String(args.eval),
      awaitPromise: true,
    });
    await sleep(900);
  }

  const metrics = await client.send("Page.getLayoutMetrics");
  const content = metrics.cssContentSize ?? metrics.contentSize;
  const fullHeight = Math.ceil(content.height);
  const clipY = Number(args.y ?? 0);
  const clipHeight = Math.min(Number(args.h ?? fullHeight), fullHeight - clipY);

  const shot = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: clipY,
      width: Math.ceil(content.width),
      height: clipHeight,
      scale: 1,
    },
  });

  fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log(
    `saved ${out} (${Math.ceil(content.width)}x${clipHeight} @y=${clipY}, page ${fullHeight})`
  );

  client.close();
  chrome.kill();
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  chrome.kill();
  process.exit(1);
});
