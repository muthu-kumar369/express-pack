const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  if (!fs.statSync(pkgPath).isDirectory()) return;

  console.log(`Processing ${pkg}...`);

  // Fix tsconfig.json - Add files explicitly
  const tsconfigPath = path.join(pkgPath, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Remove include, use files
    delete tsconfig.include;
    tsconfig.files = ["src/index.ts"];
    
    // Ensure declaration is true
    if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
    tsconfig.compilerOptions.declaration = true;
    tsconfig.compilerOptions.composite = false; // Ensure this stays false
    delete tsconfig.compilerOptions.declarationDir;

    tsconfig.references = [];
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
    console.log(`  - Updated tsconfig.json (added files, declaration: true)`);
  }
});
