# Git Workflow - Quick Reference Guide

## Repository Information
- **Remote URL**: https://github.com/BeechPPC/WorldLeader
- **Branch**: main (default)

## 🚀 Quick Push Commands

### First Time Setup (Already Done)
```bash
git remote add origin https://github.com/BeechPPC/WorldLeader.git
git branch -M main
```

### Standard Workflow - Push Changes

```bash
# 1. Check status
git status

# 2. Stage all changes
git add .

# 3. Commit with message
git commit -m "Your commit message here"

# 4. Push to GitHub
git push origin main
```

### One-Liner for Quick Updates
```bash
git add . && git commit -m "Update: description" && git push origin main
```

## 📋 Common Git Commands

### Check Current Status
```bash
git status                    # See modified files
git log --oneline -5          # See last 5 commits
git remote -v                 # See remote repository URL
```

### Staging Changes
```bash
git add .                     # Stage all changes
git add file.txt              # Stage specific file
git add app/                  # Stage specific directory
```

### Committing Changes
```bash
git commit -m "Message"       # Commit staged changes
git commit -am "Message"      # Stage and commit (tracked files only)
```

### Pushing to GitHub
```bash
git push origin main          # Push to main branch
git push -u origin main       # Push and set upstream (first time)
git push --force              # Force push (use with caution!)
```

### Pulling Latest Changes
```bash
git pull origin main          # Pull latest from GitHub
git fetch origin              # Fetch without merging
```

### Branch Management
```bash
git branch                    # List local branches
git branch feature-name       # Create new branch
git checkout feature-name     # Switch to branch
git checkout -b feature-name  # Create and switch to branch
git merge feature-name        # Merge branch into current
```

### Undoing Changes
```bash
git reset HEAD file.txt       # Unstage file
git checkout -- file.txt      # Discard local changes
git reset --hard HEAD         # Discard all local changes
git revert <commit-hash>      # Revert a commit
```

## 📝 Commit Message Best Practices

### Format
```
Type: Brief description (50 chars or less)

Detailed explanation if needed (wrap at 72 chars)
- Bullet points for multiple changes
- Use present tense ("Add feature" not "Added feature")
```

### Common Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples
```bash
git commit -m "feat: Add user registration with continent selection"
git commit -m "fix: Resolve ranking calculation bug when users tie"
git commit -m "docs: Update README with deployment instructions"
git commit -m "style: Format leaderboard page with Prettier"
```

## 🔄 Typical Development Workflow

### Daily Development
```bash
# Morning - sync with remote
git pull origin main

# Work on features...
# (make changes to files)

# Evening - commit and push
git add .
git commit -m "feat: Add purchase confirmation modal"
git push origin main
```

### Feature Branch Workflow
```bash
# Create feature branch
git checkout -b feature/stripe-integration

# Work on feature...
git add .
git commit -m "feat: Integrate Stripe payment processing"

# Push feature branch
git push origin feature/stripe-integration

# Merge to main (after testing)
git checkout main
git merge feature/stripe-integration
git push origin main

# Delete feature branch
git branch -d feature/stripe-integration
```

## 🛠 Troubleshooting

### Merge Conflicts
```bash
# When pull creates conflicts:
git pull origin main
# Fix conflicts in files marked with <<<<<<< ======= >>>>>>>
git add .
git commit -m "fix: Resolve merge conflicts"
git push origin main
```

### Forgot to Pull Before Committing
```bash
git pull --rebase origin main
# Resolve conflicts if any
git push origin main
```

### Wrong Commit Message
```bash
# If haven't pushed yet:
git commit --amend -m "Corrected message"

# If already pushed:
git commit --amend -m "Corrected message"
git push --force origin main  # Use carefully!
```

### Accidentally Committed Sensitive Data
```bash
# Remove from last commit:
git reset HEAD~1
# Remove sensitive data from files
git add .
git commit -m "Remove sensitive data"
git push --force origin main
```

## 📦 .gitignore Reference

Already configured in `.gitignore`:
```
node_modules/
.next/
.env
*.db
*.db-journal
.DS_Store
```

## 🔐 Security Best Practices

1. **Never commit**:
   - `.env` files (already in .gitignore)
   - Database files (*.db)
   - API keys or secrets
   - node_modules/

2. **Before pushing**:
   - Review changes: `git diff`
   - Check staged files: `git status`
   - Ensure .env is not staged

3. **If secrets leaked**:
   - Rotate all keys/secrets immediately
   - Use git filter-branch or BFG Repo-Cleaner to remove from history
   - Force push cleaned history

## 📊 Useful Git Aliases

Add to `~/.gitconfig`:
```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --decorate --all
```

Usage:
```bash
git st              # Instead of git status
git co main         # Instead of git checkout main
git visual          # Pretty commit graph
```

## 🚀 Deployment Workflow

### Deploying to Vercel
```bash
# Ensure main branch is up to date
git push origin main

# Vercel auto-deploys from main branch
# Check: https://vercel.com/dashboard
```

### Deploying to Railway
```bash
# Connect Railway to GitHub repo
# Push to main triggers automatic deployment
git push origin main
```

## 📞 Quick Help

### Check Remote Repository
```bash
git remote -v
```

### View Commit History
```bash
git log --oneline --graph --all -10
```

### Who Changed What
```bash
git blame filename.txt
```

### Search Commits
```bash
git log --grep="search term"
```

---

## 🎯 Quick Reference Card

| Action | Command |
|--------|---------|
| Check status | `git status` |
| Stage all | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin main` |
| Pull | `git pull origin main` |
| New branch | `git checkout -b branch-name` |
| View remotes | `git remote -v` |
| Undo changes | `git checkout -- file` |
| View history | `git log --oneline` |

---

**Keep this file updated as your workflow evolves!**

Last updated: October 27, 2025
