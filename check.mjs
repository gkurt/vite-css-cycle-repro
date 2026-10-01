import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const expected = ['feature', 'shared'];
const runs = Number(process.argv[2] ?? 10);
const tally = new Map();

for (let i = 0; i < runs; i++) {
  execSync('npx vite build --logLevel silent', { stdio: 'ignore' });
  const result = ['index', 'dashboard'].map(name => {
    const html = readFileSync(`dist/${name}.html`, 'utf8');
    const css = [...html.matchAll(/assets\/(\w+)-[\w-]+\.css/g)].map(m => m[1]).sort();
    const missing = expected.filter(c => !css.includes(c));
    return `${name}.html: ${missing.length ? `missing ${missing.join(', ')}.css` : 'ok'}`;
  }).join(' | ');
  tally.set(result, (tally.get(result) ?? 0) + 1);
}

for (const [result, count] of tally) console.log(`${count}/${runs}  ${result}`);
