# Contributing to CampusBite 🍱

First off, thank you for considering contributing to CampusBite! Follow these guidelines to ensure a smooth collaboration.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all contributors with respect, professionalism, and kindness.

---

## How Can I Contribute?

### 1. Reporting Bugs
- Search existing [GitHub Issues](https://github.com/SreeshM18/Campusbite/issues) to ensure the bug hasn't already been reported.
- If not, open a new issue using our **Bug Report** template.
- Include step-by-step reproduction instructions, screenshots, environment details, and server logs.

### 2. Suggesting Enhancements
- Check existing issues and discussions to see if someone already proposed a similar feature.
- Open a **Feature Request** issue clearly detailing the motivation, use case, and proposed architecture.

### 3. Submitting Pull Requests
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/Campusbite.git
   cd Campusbite
   ```
3. **Create a topic branch**:
   ```bash
   git checkout -b feature/awesome-new-feature
   # or
   git checkout -b fix/issue-description
   ```
4. **Install dependencies & setup environment**:
   ```bash
   npm run install:all
   cp .env.example .env
   ```
5. **Make your changes**:
   - Follow clean code practices and MERN monorepo conventions.
   - Never commit sensitive secrets, `.env` files, or passwords.
   - Respect the custom CSS design token system (`client/src/styles/tokens.css`).
6. **Run test suites & verify production build**:
   ```bash
   npm test
   npm run build
   ```
7. **Commit with Conventional Commit messages**:
   ```bash
   git commit -m "feat(order): add live order tracking step animation"
   ```
8. **Push to your fork & open a PR**:
   ```bash
   git push origin feature/awesome-new-feature
   ```

---

## Commit Guidelines

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (formatting, whitespace)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to build process, dependencies, or auxiliary tooling

---

## Local Development Setup

1. **Prerequisites**:
   - Node.js 20.x or higher
   - npm 10.x or higher
   - MongoDB 7.0+ (or MongoDB Atlas connection URI)
2. **Database Seeding**:
   ```bash
   npm run seed
   ```
3. **Start Full-Stack Development**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`
