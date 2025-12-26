const fs = require('fs');
const path = require('path');

const examplesDir = path.join(__dirname, '../examples');

const mapping = {
  'ExpressPack': '@express-pack/core',
  'AsyncRouteWrapper': '@express-pack/core',
  'MiddlewareConfig': '@express-pack/core',
  'RouteGroup': '@express-pack/core',
  'ErrorHandler': '@express-pack/core',
  'JWTUtil': '@express-pack/auth',
  'AuthMiddleware': '@express-pack/auth',
  'RequestValidator': '@express-pack/validation',
  'validate': '@express-pack/validation',
  'RedisClientService': '@express-pack/cache',
  'RabbitMQService': '@express-pack/queue',
  'CronManager': '@express-pack/scheduler',
  'EmailService': '@express-pack/email',
  'S3StorageService': '@express-pack/storage',
  'StripeService': '@express-pack/payment',
  'TimestampPlugin': '@express-pack/db',
  'SoftDeletePlugin': '@express-pack/db',
  'EncryptionUtil': '@express-pack/utils',
  'ResponseUtil': '@express-pack/utils',
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Find all imports from 'express-pack'
  // import { A, B } from 'express-pack';
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]express-pack['"];/g;
  
  content = content.replace(importRegex, (match, imports) => {
    hasChanges = true;
    const items = imports.split(',').map(s => s.trim());
    const newImports = {};

    items.forEach(item => {
      // Handle aliases: "ExpressPack as EP"
      const name = item.split(/\s+as\s+/)[0];
      const pkg = mapping[name] || 'express-pack'; // Default to facade if not mapped
      
      if (!newImports[pkg]) newImports[pkg] = [];
      newImports[pkg].push(item);
    });

    return Object.entries(newImports)
      .map(([pkg, items]) => `import { ${items.join(', ')} } from '${pkg}';`)
      .join('\n');
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${path.relative(process.cwd(), filePath)}`);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules') processDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      updateFile(filePath);
    }
  });
}

// Update package.json files in examples
function updatePackageJson(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
          const pkgPath = path.join(filePath, 'package.json');
          if (fs.existsSync(pkgPath)) {
             const pkg = require(pkgPath);
             // Add scoped dependencies
             pkg.dependencies = pkg.dependencies || {};
             // We don't remove express-pack for now, just add others
             Object.values(mapping).forEach(scope => {
                 // Add logic to strict check if used? 
                 // For simplicity, we'll just add common ones or ALL of them?
                 // Be smarter: we updated file contents, but dependencies need to be there.
                 // Just add all scoped packages for now or facade.
                 // Actually, better to keep facade dependency if we missed anything, 
                 // BUT we manually imported scoped packages.
                 // So we must add them.
                 if (scope !== 'express-pack') pkg.dependencies[scope] = "^2.0.0";
             });
             fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
             console.log(`Updated package.json in ${file}`);
          }
      }
  });
}

console.log('Migrating examples...');
processDir(examplesDir);
updatePackageJson(examplesDir);
console.log('Done.');
