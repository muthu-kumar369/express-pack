#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// code for setup
const {
  testRouterContent,
  testControllerContent,
  routeConfigJsContent,
  indexJsContent,
  appConfigJsContent,
} = require("../config/fileContent");

// Get the project's package.json path
const projectPackageJsonPath = path.resolve(process.cwd(), "package.json");
const projectDir = process.cwd();
const configDir = path.join(projectDir, "config");
const srcDir = path.join(projectDir, "src", "test");

// Function to prompt user input
const askQuestion = (query) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
};

const createDirIfNotExist = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // Create the directory and any necessary parent directories
  }
};

(async () => {
  if (!fs.existsSync(projectPackageJsonPath)) {
    console.log("⚠️ package.json not found in the project.");
    process.exit(1);
  }

  // Read the existing package.json content
  const packageJson = require(projectPackageJsonPath);

  // Ensure the scripts object exists (doesn't overwrite anything else in package.json)
  packageJson.scripts = packageJson.scripts || {};

  // Ask user if they want to use nodemon
  const useNodemon = await askQuestion(
    "Do you want to use nodemon for development? (yes/no): "
  );

  // Modify the dev script based on the user's input
  if (useNodemon === "yes" || useNodemon === "y") {
    packageJson.scripts.dev = "npx nodemon index.js"; // Use nodemon if yes
    console.log("✅ Configured to use nodemon (npm run dev).");
  } else {
    packageJson.scripts.dev = "node index.js"; // Use regular node if no
    console.log("🚀 Skipping nodemon. Use 'npm run dev' to start the app.");
  }

  // Ensure the start script is always set to use node
  packageJson.scripts.start = "node index.js";

  // Write back the modified package.json, only modifying the scripts section
  fs.writeFileSync(
    projectPackageJsonPath,
    JSON.stringify(packageJson, null, 2)
  );

  // Ask user if they want to create the app structure
  const setupApp = await askQuestion(
    "Do you want to set up the basic Express app structure? (yes/no): "
  );

  if (setupApp === "yes" || setupApp === "y") {
    // Create necessary directories and files
    if (!fs.existsSync(configDir)) createDirIfNotExist(configDir);
    if (!fs.existsSync(srcDir)) createDirIfNotExist(srcDir);

    fs.writeFileSync(path.join(projectDir, "index.js"), indexJsContent);

    fs.writeFileSync(path.join(configDir, "appConfig.js"), appConfigJsContent);

    fs.writeFileSync(
      path.join(configDir, "routeConfig.js"),
      routeConfigJsContent
    );

    if (!fs.existsSync(path.join(srcDir, "controller")))
      fs.mkdirSync(path.join(srcDir, "controller"));
    fs.writeFileSync(
      path.join(srcDir, "controller", "index.js"),
      testControllerContent
    );

    if (!fs.existsSync(path.join(srcDir, "router")))
      fs.mkdirSync(path.join(srcDir, "router"));
    fs.writeFileSync(
      path.join(srcDir, "router", "index.js"),
      testRouterContent
    );

    console.log(
      "🎉 Express app structure created successfully with default routes."
    );
  }

  console.log("🎉 Setup complete!");
})();
