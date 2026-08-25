# Malameran

A dependency-free B2B sourcing and procurement site with a first-stage client
area: sign up, log in, submit a procurement project, and review submitted
projects from a dashboard.

No build step, no `npm install`, no framework.

## How to run

Open `index.html` directly in your browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>. VS Code Live Server works too.

## Pages

| File                 | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `index.html`         | Marketing site — services, industries, about, contact form |
| `signup.html`        | Create an account (name, email, company, password)          |
| `login.html`         | Sign in (email, password)                                   |
| `start-project.html` | Submit a procurement project — **requires an account**      |
| `dashboard.html`     | Client area — project list and project detail               |

## Scripts

| File                    | Responsibility                                              |
| ----------------------- | ----------------------------------------------------------- |
| `assets/js/store.js`    | **All** persistence: accounts, session, projects             |
| `assets/js/forms.js`    | Shared inline validation and error rendering                 |
| `assets/js/auth.js`     | Login/signup handlers, route protection, `?next=` redirects  |
| `assets/js/main.js`     | Navbar, session-aware header, scroll reveal, contact form    |
| `assets/js/project.js`  | Project intake form                                          |
| `assets/js/dashboard.js`| Project list and detail views                                |

`assets/css/styles.css` holds the design tokens, shared UI and the landing
page. `assets/css/app.css` holds the auth, intake and dashboard surfaces.

## Stage-one limitations

These are deliberate for this milestone:

- **Accounts live in `localStorage`.** Data is per-browser and per-device, and
  there is no real security. This is a prototype for client review, not a
  production auth system.
- **No email is sent.** Both the landing contact form and the project form only
  confirm submission on screen.
- **No email verification** on sign-up — accounts are active immediately.
- **No file uploads.** The project detail view has a placeholder where image and
  document attachments will go.

## Replacing the prototype backend

`assets/js/store.js` is the only file that touches storage. Every page calls it
through `window.App` and nothing else, so swapping in a real backend means
rewriting the bodies of these functions as `fetch()` calls:

```
signUp(input)   logIn(email, password)   logOut()   currentUser()
addProject(d)   listProjects()           getProject(id)
```

Keep the return shapes — `{ ok: true, ... }` or `{ ok: false, field, error }` —
and no page code needs to change.

`GP.PROJECT_FIELDS` is the single definition of the project form: adding a
field there makes it appear in the form validation and the dashboard detail
view. The form markup in `index.html` and `start-project.html` must use
matching `name` attributes.
