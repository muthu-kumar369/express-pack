const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');

// Add missing dependencies to db package
const dbPkgPath = path.join(packagesDir, 'db', 'package.json');
if (fs.existsSync(dbPkgPath)) {
  const pkgJson = JSON.parse(fs.readFileSync(dbPkgPath, 'utf8'));
  pkgJson.dependencies = {
    ...pkgJson.dependencies,
    'bcryptjs': '^2.4.3',
    'sanitize-html': '^2.13.1',
    'slugify': '^1.6.6'
  };
  pkgJson.devDependencies = {
    ...pkgJson.devDependencies,
    '@types/bcryptjs': '^2.4.6',
    '@types/sanitize-html': '^2.13.0'
  };
  fs.writeFileSync(dbPkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log('Updated db package.json');
}

// Add @types/node to scheduler package
const schedulerPkgPath = path.join(packagesDir, 'scheduler', 'package.json');
if (fs.existsSync(schedulerPkgPath)) {
  const pkgJson = JSON.parse(fs.readFileSync(schedulerPkgPath, 'utf8'));
  pkgJson.devDependencies = {
    ...pkgJson.devDependencies,
    '@types/node': '^22.10.2'
  };
  fs.writeFileSync(schedulerPkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log('Updated scheduler package.json');
}
