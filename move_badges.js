const fs = require('fs');

const file = 'src/components/progress-charts.tsx';
let content = fs.readFileSync(file, 'utf8');

const badgeRegex = /\s*\{\/\* Gamification Badges Row \*\/\}\s*<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">[\s\S]*?<\/div>\s*<\/div>\n/;

const match = content.match(badgeRegex);

if (match) {
  content = content.replace(match[0], '\n');
  const insertIndex = content.lastIndexOf('</div>\n    </div>\n  )\n}');
  content = content.slice(0, insertIndex) + match[0] + content.slice(insertIndex);
  fs.writeFileSync(file, content);
  console.log('Moved badges row to bottom successfully.');
} else {
  console.log('Badge row not found.');
}
