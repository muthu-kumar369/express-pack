const fs = require('fs');
const path = require('path');

const schedulerPkgPath = path.join(__dirname, '../packages/scheduler/package.json');
const pkgJson = JSON.parse(fs.readFileSync(schedulerPkgPath, 'utf8'));

pkgJson.devDependencies = {
  ...pkgJson.devDependencies,
  '@types/node-cron': '^3.0.11'
};

fs.writeFileSync(schedulerPkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
console.log('Added @types/node-cron to scheduler');
