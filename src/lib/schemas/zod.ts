import { z } from "zod";

/**
 * Zod, configured once, re-exported so import order cannot be got wrong.
 *
 * `jitless` turns off Zod's JIT validator compiler. It is not a performance
 * choice — it is a Content-Security-Policy one. Zod feature-detects the JIT with
 * `try { Function(""), true } catch { false }`, and under our CSP, which has no
 * `'unsafe-eval'`, that throws. Zod handles it and falls back to the interpreted
 * path, so validation is correct either way — but the browser still reports a
 * `script-src` violation on every page that loads a schema, which is console
 * noise that looks like a bug and is not one.
 *
 * Asking for the fallback directly costs nothing measurable on a thirteen-field
 * form and keeps `'unsafe-eval'` out of the policy. Parse results are identical;
 * verified against both the success and the failure paths.
 *
 * Import `z` from here, never from "zod" directly, in anything that defines a
 * schema.
 */
z.config({ jitless: true });

export { z };
