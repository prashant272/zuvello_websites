import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src/pages');

function toTitleCase(str) {
  // Convert camelCase or PascalCase to Title Case with spaces
  return str.replace(/([A-Z])/g, ' $1').trim();
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('components/SEO')) {
    console.log(`Skipping ${filePath}, SEO already added`);
    return;
  }

  const basename = path.basename(filePath, '.jsx');
  const pageTitle = basename === 'Home' ? 'Home' : toTitleCase(basename).replace('Page', '').trim();
  
  // 1. Add import
  const importStatement = `import SEO from '../components/SEO';\n`;
  
  // Find the last import statement
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
  } else {
    content = importStatement + content;
  }

  // 2. Add SEO component right after the first main tag inside the return
  // We'll look for `return (` and then the very next tag `<div`, `<main`, `<section`, or `<>`.
  
  // Match `return (` followed by optional whitespace and then a tag
  const returnRegex = /return\s*\(\s*(<[a-zA-Z]+[^>]*>|<Fragment>|<>)/;
  
  const match = content.match(returnRegex);
  
  if (match) {
    const tag = match[1]; // e.g. `<div className="foo">`
    const seoComponent = `\n      <SEO title="${pageTitle}" />`;
    const replacement = `return (\n    ${tag}${seoComponent}`;
    
    content = content.replace(match[0], replacement);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Processed ${filePath}`);
  } else {
    // try matching just `return <div` without parens
    const returnRegexNoParens = /return\s*(<[a-zA-Z]+[^>]*>|<Fragment>|<>)/;
    const match2 = content.match(returnRegexNoParens);
    if (match2) {
      const tag = match2[1];
      const seoComponent = `\n      <SEO title="${pageTitle}" />`;
      const replacement = `return (\n    <>
      <SEO title="${pageTitle}" />
      ${tag}`;
      // Note: we can't just wrap in <> without closing it, so maybe just insert inside the tag if it's not self-closing.
      // But it's safer to just let me know.
      console.log(`Needs manual review: ${filePath}`);
    } else {
      console.log(`Could not find return block in ${filePath}`);
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.jsx')) {
      processFile(filePath);
    }
  }
}

walkDir(pagesDir);
console.log("Done.");
