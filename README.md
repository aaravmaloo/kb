# KB (Knowledge Base) CLI

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-blue.svg)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**KB** is a powerful, developer-centric Knowledge Base CLI tool powered by **Supabase**. Store notes, code snippets, and files directly from your terminal with full-text search, version history, and realtime updates.

---

## Features

| Feature | Description | Supabase Powered |
| :--- | :--- | :--- |
| **Auth** | Secure login & multi-user support | Auth (GoTrue) |
| **Notes** | Structured storage for markdown/text | PostgreSQL |
| **Search** | Professional full-text search logic | PG Search Vector |
| **Storage** | Attach PDFs, images, and code files | Supabase Storage |
| **Realtime** | Live dashboard for activity tracking | Realtime Engine |
| **History** | Automatic version history on edits | DB Triggers |
| **Standalone** | Single `.exe` binary distribution | V8 Snapshot |

---

## Getting Started

### 1. Download & Prepare
Download the latest `kb.exe` from the [bin/](./bin/) directory.

### 2. Authentication
```bash
# Sign up for a new account
kb auth signup

# Login to your existing account
kb auth login
```

### 3. Basic Usage
```bash
# Add a new note with tags
kb add "Supabase Tips" --tags coding,database

# List all your notes
kb list

# Search for specific content
kb search "postgres"

# View a note's full content
kb view <note_id_prefix>
```

---

## Commands Reference

| Command | Usage | Description |
| :--- | :--- | :--- |
| `auth` | `kb auth [login/signup/logout]` | Manage user session |
| `add` | `kb add <title> [-t tags] [-p]` | Create a new note |
| `list` | `kb list [--tag name]` | List notes with optional filter |
| `search`| `kb search <query>` | Full-text search over all notes |
| `view` | `kb view <id>` | Display note content |
| `history`| `kb history <id>` | Show previous versions of a note |
| `attach` | `kb attach <id> <file>` | Upload a file to a note |
| `files` | `kb files <id>` | List attachments for a note |
| `download`| `kb download <id> <name>` | Retrieve an attachment |
| `dashboard`| `kb dashboard` | Realtime activity feed |

---

## Build from Source

If you want to compile the binary yourself:

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```
4. **Package the binary**:
   ```bash
   npm run package
   ```

> [!IMPORTANT]
> The binary is optimized for Node.js 18+ environments. If you see a deprecation warning, it's safe to ignore as it comes from the internal Supabase SDK version.

---

## License
Distributed under the MIT License. See `LICENSE` for more information.
