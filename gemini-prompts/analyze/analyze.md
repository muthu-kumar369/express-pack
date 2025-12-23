You are a senior full-stack architect and npm package maintainer.

Context:
This repository contains multiple folders, but your task is to analyze ONLY the following two folders:
- express-pack/
- react-pack/

Ignore all other folders and files completely.

Goal:
These two packages are internal npm packages used to centralize and standardize Node.js (Express) and React.js development across multiple projects.

Your task is divided into clear phases. Follow them strictly in order.

--------------------------------------------------
PHASE 1: EXISTING ANALYSIS & UNDERSTANDING
--------------------------------------------------

1. Analyze the `express-pack` folder:
   - Folder structure
   - Design patterns used
   - Configuration approach
   - Abstractions provided (middlewares, utils, base setup, etc.)
   - Intended usage and developer experience
   - Strengths of the current implementation

2. Analyze the `react-pack` folder:
   - Folder structure
   - Component architecture
   - State management approach (if any)
   - Configuration and reusability patterns
   - Intended usage and developer experience
   - Strengths of the current implementation

Do NOT suggest improvements in this phase.
Only explain what exists and what problem it is currently solving.

--------------------------------------------------
PHASE 2: GAP ANALYSIS & IMPROVEMENTS
--------------------------------------------------

For EACH package (`express-pack` and `react-pack`) provide:

1. What is missing or weak:
   - Architectural gaps
   - Scalability concerns
   - Developer experience issues
   - Maintainability problems
   - Versioning or extensibility limitations

2. Concrete improvement suggestions:
   - Folder restructuring (if needed)
   - Better abstraction ideas
   - Config standardization
   - Plugin or extension support
   - Documentation or DX improvements

Keep suggestions practical and aligned with real-world npm package usage.

--------------------------------------------------
PHASE 3: CONNECTION BETWEEN EXPRESS-PACK & REACT-PACK
--------------------------------------------------

1. Analyze whether a meaningful connection is possible between the two:
   - Shared conventions
   - Shared config/schema/contracts
   - Shared tooling or CLI
   - Shared types (OpenAPI, Zod, DTOs, etc.)

2. Suggest ways to integrate them as a single ecosystem:
   - Backend–frontend contract sharing
   - Unified project scaffolding
   - Environment/config sync
   - Auth, API, error handling consistency

3. Propose an optional future vision:
   - Monorepo or separate repo strategy
   - Shared core package (if applicable)
   - How this can evolve into a “full-stack starter system”

--------------------------------------------------
PHASE 4: FINAL OUTPUT FORMAT
--------------------------------------------------

Structure your response exactly like this:

1. express-pack
   - Current Understanding
   - Strengths
   - Improvements Needed

2. react-pack
   - Current Understanding
   - Strengths
   - Improvements Needed

3. express-pack ↔ react-pack Integration
   - Current Disconnects
   - Possible Connections
   - Recommended Architecture

4. Strategic Recommendations
   - Short-term (quick wins)
   - Long-term (ecosystem vision)

Be concise, technical, and opinionated like a real product architect.
Avoid generic advice.
