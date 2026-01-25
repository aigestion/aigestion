# Chrome God-Level Extensions 🧩

Since the "GodMode" Chrome runs in an isolated profile (`.gemini\chrome_dev_profile`), it starts clean. You will need to install these essential development extensions **once**.

## 1. Primary DevTools (Mandatory)
- **[React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)**: Debug React component hierarchy.
- **[Redux DevTools](https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)**: Time-travel debugging for AIGestion state.

## 2. Performance & API
- **[Lighthouse](https://chromewebstore.google.com/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)**: For audits (built-in to DevTools, but extension can be handy).
- **[JSON Viewer Pro](https://chromewebstore.google.com/detail/json-viewer-pro/eifflpmocdbdmepbjaopkkhbfmdgijcc)**: Makes API JSON responses readable.

## 3. How to Install
1. Run `.\scripts\ChromeGodMode.ps1` to open the browser.
2. Click the links above.
3. "Add to Chrome".
4. (Optional) Run `chrome://extensions` and enable "Allow in Incognito" if you debug there.

> **Note**: This profile is separate from your personal one. Themes, bookmarks, and passwords will not sync unless you explicitly sign in (not recommended for isolation).
