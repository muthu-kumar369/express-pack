## 🔄 Migration Guide (v1 → v2)

Upgrading from v1.x to v2.0.0? We've got you covered!

v2.0.0 is a major rewrite with full TypeScript support, ESM modules, and improved APIs. While there are breaking changes, migration is straightforward.

### Quick Migration

```bash
# 1. Update package.json
npm install express-pack@^2.0.0 express@^4.0.0

# 2. Use automated migration tool
node node_modules/express-pack/scripts/migrate-v1-to-v2.js

# 3. Follow the prompts and test your app
npm test
```

### Key Changes

- ✅ **ESM Modules** - Use `import` instead of `require`
- ✅ **Async Init** - `await ExpressPack.init({ app, config })`
- ✅ **TypeScript** - Full type safety (optional)
- ✅ **Object Parameters** - Better API design

### Full Migration Guide

📖 **[Read the complete migration guide](./MIGRATION.md)** for:
- Detailed breaking changes
- Step-by-step instructions
- Common issues & solutions
- Rollback procedures

---
