const fs = require('fs');
const path = require('path');

const authDeps = {
  dependencies: {
    '@express-pack/core': '^2.0.0',
    'jsonwebtoken': '^9.0.2',
    'passport': '^0.7.0',
    'passport-google-oauth20': '^2.0.0',
    'passport-facebook': '^3.0.0',
    'passport-github2': '^0.1.12',
    'bcrypt': '^5.1.1'
  },
  devDependencies: {
    '@types/jsonwebtoken': '^9.0.7',
    '@types/passport': '^1.0.17',
    '@types/passport-google-oauth20': '^2.0.16',
    '@types/passport-facebook': '^3.0.3',
    '@types/passport-github2': '^1.2.9',
    '@types/bcrypt': '^5.0.2'
  }
};

const testingDeps = {
  dependencies: {
    '@express-pack/core': '^2.0.0',
    'supertest': '^7.0.0',
    'mongodb-memory-server': '^10.1.2'
  },
  devDependencies: {
    '@types/supertest': '^6.0.2'
  }
};

const packagesDir = path.join(__dirname, '../packages');

// Update auth
const authPkgPath = path.join(packagesDir, 'auth', 'package.json');
if (fs.existsSync(authPkgPath)) {
  const pkgJson = JSON.parse(fs.readFileSync(authPkgPath, 'utf8'));
  pkgJson.dependencies = { ...pkgJson.dependencies, ...authDeps.dependencies };
  pkgJson.devDependencies = { ...pkgJson.devDependencies, ...authDeps.devDependencies };
  fs.writeFileSync(authPkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log('Updated auth package.json');
}

// Update testing
const testingPkgPath = path.join(packagesDir, 'testing', 'package.json');
if (fs.existsSync(testingPkgPath)) {
  const pkgJson = JSON.parse(fs.readFileSync(testingPkgPath, 'utf8'));
  pkgJson.dependencies = { ...pkgJson.dependencies, ...testingDeps.dependencies };
  pkgJson.devDependencies = { ...pkgJson.devDependencies, ...testingDeps.devDependencies };
  fs.writeFileSync(testingPkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log('Updated testing package.json');
}
