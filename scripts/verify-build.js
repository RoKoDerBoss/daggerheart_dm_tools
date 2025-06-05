#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const outputDir = path.join(__dirname, '..', 'out')

console.log('🔍 Verifying Netlify build...\n')

// Check if output directory exists
if (!fs.existsSync(outputDir)) {
  console.error('❌ Output directory "out" not found. Run "npm run build" first.')
  process.exit(1)
}

// Required files for Netlify deployment
const requiredFiles = [
  'index.html',
  '_next/static',
  'tools/index.html',
  'tools/battle-point-calculator/index.html',
  'sitemap.xml',
  'robots.txt'
]

console.log('Checking required files:')
let allFilesPresent = true

requiredFiles.forEach(file => {
  const filePath = path.join(outputDir, file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allFilesPresent = false
  }
})

// Check for netlify.toml in root
const netlifyToml = path.join(__dirname, '..', 'netlify.toml')
if (fs.existsSync(netlifyToml)) {
  console.log('✅ netlify.toml')
} else {
  console.log('❌ netlify.toml - MISSING')
  allFilesPresent = false
}

// Check for dynamic routes
console.log('\n🔗 Dynamic routes generated:')
const toolsDir = path.join(outputDir, 'tools')
if (fs.existsSync(toolsDir)) {
  const toolDirs = fs.readdirSync(toolsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  if (toolDirs.length > 0) {
    toolDirs.forEach(tool => {
      const indexFile = path.join(toolsDir, tool, 'index.html')
      if (fs.existsSync(indexFile)) {
        console.log(`✅ /tools/${tool}`)
      } else {
        console.log(`❌ /tools/${tool} - Missing index.html`)
        allFilesPresent = false
      }
    })
  } else {
    console.log('❌ No tool routes found')
    allFilesPresent = false
  }
} else {
  console.log('❌ Tools directory not found')
  allFilesPresent = false
}

console.log('\n📊 Build statistics:')

// Get build size
function getDirSize(dirPath) {
  let size = 0
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
    files.forEach(file => {
      const filePath = path.join(dirPath, file.name)
      if (file.isDirectory()) {
        size += getDirSize(filePath)
      } else {
        size += fs.statSync(filePath).size
      }
    })
  }
  return size
}

const totalSize = getDirSize(outputDir)
const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2)

console.log(`Total build size: ${sizeInMB} MB`)

// Count total files
function countFiles(dirPath) {
  let count = 0
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
    files.forEach(file => {
      const filePath = path.join(dirPath, file.name)
      if (file.isDirectory()) {
        count += countFiles(filePath)
      } else {
        count++
      }
    })
  }
  return count
}

const totalFiles = countFiles(outputDir)
console.log(`Total files: ${totalFiles}`)

// Check for large files (>1MB)
function findLargeFiles(dirPath, threshold = 1024 * 1024) {
  const largeFiles = []
  
  function traverse(currentPath) {
    if (!fs.existsSync(currentPath)) return
    const files = fs.readdirSync(currentPath, { withFileTypes: true })
    files.forEach(file => {
      const filePath = path.join(currentPath, file.name)
      if (file.isDirectory()) {
        traverse(filePath)
      } else {
        const size = fs.statSync(filePath).size
        if (size > threshold) {
          largeFiles.push({
            path: path.relative(outputDir, filePath),
            size: (size / (1024 * 1024)).toFixed(2) + ' MB'
          })
        }
      }
    })
  }
  
  traverse(dirPath)
  return largeFiles
}

const largeFiles = findLargeFiles(outputDir)
if (largeFiles.length > 0) {
  console.log('\n⚠️  Large files found (>1MB):')
  largeFiles.forEach(file => {
    console.log(`   ${file.path} - ${file.size}`)
  })
  console.log('Consider optimizing these files for better performance.')
} else {
  console.log('✅ No large files detected')
}

console.log('\n🚀 Deployment readiness:')

if (allFilesPresent && totalSize < 500 * 1024 * 1024) { // 500MB limit
  console.log('✅ Build is ready for Netlify deployment!')
  console.log('\nNext steps:')
  console.log('1. Push changes to your Git repository')
  console.log('2. Connect repository to Netlify')
  console.log('3. Set build command: npm run build')
  console.log('4. Set publish directory: out')
  console.log('5. Set Node.js version: 18.17.0')
  console.log('6. Deploy!')
  console.log('\n🔧 Optional optimizations:')
  console.log('- Enable branch deploys for preview')
  console.log('- Set up custom domain')
  console.log('- Configure environment variables')
} else {
  console.log('❌ Build has issues that need to be resolved before deployment.')
  if (totalSize >= 500 * 1024 * 1024) {
    console.log('   - Build size exceeds 500MB Netlify limit')
  }
  process.exit(1)
}

console.log('\n📝 For detailed deployment instructions, see NETLIFY_DEPLOYMENT.md') 