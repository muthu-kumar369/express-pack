const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

// Also root package.json
const rootPkgPath = path.join(__dirname, '../package.json');
if (fs.existsSync(rootPkgPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    if (pkgJson.devDependencies && pkgJson.devDependencies.typescript) {
        pkgJson.devDependencies.typescript = "5.3.3";
        fs.writeFileSync(rootPkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
        console.log('Updated root package.json typescript version');
    }
}

packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  if (!fs.statSync(pkgPath).isDirectory()) return;

  const pkgJsonPath = path.join(pkgPath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    if (pkgJson.devDependencies && pkgJson.devDependencies.typescript) {
      pkgJson.devDependencies.typescript = "5.3.3";
      fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
      console.log(`Updated ${pkg} typescript version`);
    }
  }
});
