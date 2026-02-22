const fs = require('fs');
const path = require('path');

// List of static assets extensions to include
const ASSET_EXTENSIONS = ['.html', '.css', '.js', '.exe', '.ps1', '.zip', '.msi'];

// Paths for source and output directories
const SOURCE_DIRECTORY = '.';
const OUTPUT_DIRECTORY = 'public';

// Function to copy files
function copyFiles(srcDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.readdirSync(srcDir, { withFileTypes: true }).forEach((entry) => {
    const srcPath = path.join(srcDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    // FIXED: Compare absolute paths to avoid infinite copying
    if (path.resolve(srcPath) === path.resolve(OUTPUT_DIRECTORY)) return;

    // Handle subdirectories recursively
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (['.git', 'node_modules'].includes(entry.name)) return;
      copyFiles(srcPath, outputPath);
    } else {
      // Only include relevant static assets
      if (ASSET_EXTENSIONS.includes(path.extname(entry.name))) {
        fs.copyFileSync(srcPath, outputPath);
        console.log(`Copied: ${srcPath} -> ${outputPath}`);
      }
    }
  });
}

// Function to build the public directory
function buildPublicDirectory() {
  if (fs.existsSync(OUTPUT_DIRECTORY)) {
    fs.rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });
  }
  copyFiles(SOURCE_DIRECTORY, OUTPUT_DIRECTORY);
  console.log('Public directory built successfully.');
}

// Execute the build process
buildPublicDirectory();
