# Quick Git + SSH Cheat Sheet

Save this for future reference.

## Check current Git user

```bash
git config user.name
git config user.email
```

Global Git user:

```bash
git config --global user.name
git config --global user.email
```

Repository-specific Git user:

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## Check Git Remote

```bash
git remote -v
```

Change remote to SSH:

```bash
git remote set-url origin git@github-businesshub:username/repository.git
```

---

## Check current branch

```bash
git branch
```

Create new branch

```bash
git checkout -b feature/my-feature
```

---

## Push first time

```bash
git push -u origin develop
```

Normal push

```bash
git push
```

---

## Pull latest

```bash
git pull
```

---

## Fetch

```bash
git fetch
```

---

## SSH Commands

Test GitHub account

```bash
ssh -T git@github-businesshub
```

```bash
ssh -T git@github-z4heer
```

List loaded keys

```bash
ssh-add -l
```

Add a key manually

```bash
ssh-add ~/.ssh/id_ed25519_businesshub
```

---

## keychain

Reload

```bash
source ~/.bashrc
```

Restart WSL

```powershell
wsl --shutdown
```

---

## Useful Git

Status

```bash
git status
```

Commit

```bash
git commit -m "message"
```

Log

```bash
git log --oneline --graph
```

