const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'packages/core/src/util/date/range/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/core/src/util/date/manipulate/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/core/src/util/date/edge-case/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/core/src/util/date/duration/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/core/src/util/date/create/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/core/src/util/date/compare/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/core/src/util/date/business/index.ts',
    from: 'from "@/util/types"',
    to: 'from "../../types"'
  },
  {
    file: 'packages/auth/src/util/strategy/index.ts',
    from: 'from "@/auth/types/util/passport.util.types"',
    to: 'from "../../types/util/passport.util.types"'
  },
  {
    file: 'packages/auth/src/util/passport/index.ts',
    from: 'from "@/auth/types/util/passport.util.types"',
    to: 'from "../../types/util/passport.util.types"'
  }
];

fixes.forEach(fix => {
  const filePath = path.join(__dirname, '..', fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(fix.from, fix.to);
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${fix.file}`);
  } else {
    console.log(`Not found: ${fix.file}`);
  }
});

console.log('All path aliases fixed!');
