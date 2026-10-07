const PREFIX = "zb-product-v1:";
export function readDemo<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
export function writeDemo(key: string, value: unknown) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch { return false; }
}
export function resetDemoProfile(kind: "personal" | "business") {
  try {
    const keys = Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter((key):key is string=>!!key);
    for (const key of keys) {
      if ([`goals:${kind}`,`cards:${kind}`,`notifications:${kind}`,`previews:${kind}`,`recipients:${kind}`,`draft:${kind}:send`,`draft:${kind}:transfer`].some(part=>key===PREFIX+part)||key.startsWith(PREFIX+`note:${kind}:`)) localStorage.removeItem(key);
    }
    return true;
  } catch { return false; }
}
