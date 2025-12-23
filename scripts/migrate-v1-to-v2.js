#!/usr/bin/env node

/**
 * express-pack v1 → v2 Migration Tool
 * 
 * Automates common migration tasks from v1.x to v2.0.0
 * 
 * Usage:
 *   node migrate-v1-to-v2.js           # Run migration
 *   node migrate-v1-to-v2.js --dry-run # Preview changes
 *   node migrate-v1-to-v2.js --backup  # Create backup first
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const createBackup = args.includes('--backup');

console.log('🚀 express-pack v1 → v2 Migration Tool\\n');

if (isDryRun) {
  console.log('📋 DRY RUN MODE - No changes will be made\\n');
}

// Step 1: Check if package.json exists
console.log('📦 Checking project...');
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Run this script from your project root.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.dependencies?.['express-pack'] || 'not installed';
console.log(`   Current express-pack version: ${currentVersion}`);

if (!packageJson.dependencies?.['express-pack']) {
  console.error('❌ Error: express-pack not found in dependencies');
  process.exit(1);
}

// Step 2: Create backup
if (createBackup && !isDryRun) {
  console.log('\\n💾 Creating backup...');
  try {
    execSync('git stash push -m "express-pack-migration-backup"', { stdio: 'inherit' });
    console.log('   ✓ Backup created (git stash)');
  } catch (error) {
    console.warn('   ⚠️  Could not create git backup. Continuing anyway...');
  }
}

// Step 3: Update package.json
console.log('\\n📝 Updating package.json...');
const updates = [];

if (!packageJson.type || packageJson.type !== 'module') {
  packageJson.type = 'module';
  updates.push('Added "type": "module"');
}

if (packageJson.dependencies['express-pack']) {
  packageJson.dependencies['express-pack'] = '^2.0.0';
  updates.push('Updated express-pack to ^2.0.0');
}

if (!packageJson.dependencies['express']) {
  packageJson.dependencies['express'] = '^4.0.0';
  updates.push('Added express as dependency');
}

if (updates.length > 0) {
  if (!isDryRun) {
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\\n');
  }
  updates.forEach(update => console.log(`   ${isDryRun ? '(would)' : '✓'} ${update}`));
} else {
  console.log('   ℹ️  No changes needed');
}

// Step 4: Find files to transform
console.log('\\n🔍 Finding files to transform...');
let files = [];

try {
  // Find JavaScript/TypeScript files
  const findCommand = process.platform === 'win32'
    ? 'dir /s /b *.js *.ts 2>nul'
    : 'find . -type f \\( -name "*.js" -o -name "*.ts" \\) ! -path "*/node_modules/*" ! -path "*/dist/*"';
  
  const output = execSync(findCommand, { encoding: 'utf8', stdio: 'pipe' });
  files = output.split('\\n').filter(Boolean);
  
  // Filter to only files that likely use express-pack
  files = files.filter(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content.includes('express-pack') || content.includes('ExpressPack');
    } catch {
      return false;
    }
  });
  
  console.log(`   Found ${files.length} files to check`);
} catch (error) {
  console.warn('   ⚠️  Could not automatically find files. Please transform manually.');
  files = [];
}

// Step 5: Transform code
if (files.length > 0) {
  console.log('\\n🔄 Transforming code...');
  
  let transformedCount = 0;
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;
      const originalContent = content;
      
      // Transform 1: require to import
      const requirePattern = /const\\s+{\\s*([^}]+)\\s*}\\s*=\\s*require\\(['\"]express-pack['\"]\\)/g;
      if (requirePattern.test(content)) {
        content = content.replace(
          requirePattern,
          'import { $1 } from "express-pack"'
        );
        changed = true;
      }
      
      // Transform 2: ExpressPack.init(app, config) to await ExpressPack.init({ app, config })
      const initPattern = /ExpressPack\\.init\\(\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*,\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\)/g;
      if (initPattern.test(content)) {
        content = content.replace(
          initPattern,
          'await ExpressPack.init({ app: $1, config: $2 })'
        );
        changed = true;
      }
      
      // Transform 3: Add .js extension to relative imports (basic)
      const relativeImportPattern = /from\s+['"](\.\.\/ | \.\/)([^'"]+)['"]/g;
      content = content.replace(relativeImportPattern, (match, prefix, importPath) => {
        if (!importPath.endsWith('.js') && !importPath.endsWith('.ts') && !importPath.endsWith('.json')) {
          changed = true;
          return `from "${prefix}${importPath}.js"`;
        }
        return match;
      });
      
      if (changed) {
        if (!isDryRun) {
          fs.writeFileSync(file, content);
        }
        console.log(`   ${isDryRun ? '(would transform)' : '✓ Transformed'} ${file}`);
        transformedCount++;
      }
    } catch (error) {
      console.warn(`   ⚠️  Could not transform ${file}: ${error.message}`);
    }
  });
  
  if (transformedCount === 0) {
    console.log('   ℹ️  No transformations needed');
  }
}

// Step 6: Install dependencies
if (!isDryRun) {
  console.log('\\n📥 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('   ✓ Dependencies installed');
  } catch (error) {
    console.error('   ❌ Failed to install dependencies');
    console.error('   Please run: npm install');
  }
}

// Step 7: Summary
console.log('\n' + '='.repeat(60));
if (isDryRun) {
  console.log('📋 DRY RUN COMPLETE - No changes were made');
  console.log('\nTo apply these changes, run:');
  console.log('   node migrate-v1-to-v2.js');
} else {
  console.log('✅ Migration complete!');
}

console.log('\n📋 Next steps:');
console.log('   1. Review the changes: git diff');
console.log('   2. Update configuration objects (see MIGRATION.md)');
console.log('   3. Test your application: npm test');
console.log('   4. Start dev server: npm run dev');
if (createBackup) {
  console.log('   5. If issues occur: git stash pop (restore backup)');
}

console.log('\\n📖 Full migration guide:');
console.log('   https://github.com/muthu-kumar369/express-pack/blob/main/MIGRATION.md');

console.log('\\n⚠️  IMPORTANT: Manual steps required:');
console.log('   • Update configuration from boolean to objects');
console.log('   • Ensure all async functions use await');
console.log('   • Add .js extensions to all relative imports');
console.log('   • Test thoroughly before deploying');

console.log('\\n' + '='.repeat(60));
