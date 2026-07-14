const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src/screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));

let changedCount = 0;

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Replace pb-24 or pb-32 with pb-8 in contentContainerStyle
  content = content.replace(/(contentContainerStyle=\{tw`[^`]*)pb-(?:24|32)([^`]*`\})/g, '$1pb-8$2');
  
  // There are some non contentContainerStyle pb-24 and pb-32? Let's just do contentContainerStyle for now.
  // Actually, some places just have style={tw`... pb-24`} on the outer view.
  // Let's also replace general pb-24 and pb-32 with pb-8 inside tw`` just to be safe, but only if they are the last or only pb- on the element?
  // Let's stick to contentContainerStyle first.
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + file);
    changedCount++;
  }
});

console.log('Total files fixed: ' + changedCount);
