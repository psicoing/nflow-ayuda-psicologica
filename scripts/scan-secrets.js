import fs from 'fs';
import path from 'path';

const targetExtensions = ['.js', '.ts', '.tsx', '.html', '.env', '.json'];

const keywords = [
  'VITE_', 'API_KEY', 'SECRET', 'TOKEN', 'firebaseConfig', 'plan_id',
  'client_id', 'client_secret', 'PAYPAL', 'stripe', 'access_token',
  'OPENAI', 'DATABASE_URL', 'SESSION_SECRET'
];

const scanFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  let found = false;

  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[\\s=:]+["'\`]?([A-Za-z0-9-_]+)`, 'gi');
    const matches = [...content.matchAll(regex)];

    if (matches.length) {
      console.log(`\n🔍 Posibles secretos en: ${filePath}`);
      matches.forEach(match => console.log(`   🧪 ${match[0]}`));
      found = true;
    }
  }

  return found;
};

const scanDir = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    
    // Ignorar node_modules y .git
    if (file === 'node_modules' || file === '.git') {
      continue;
    }

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDir(filePath);
    } else {
      if (targetExtensions.includes(path.extname(file))) {
        scanFile(filePath);
      }
    }
  }
};

console.log('⚔️ Escaneando archivos del proyecto en busca de secretos...\n');
scanDir('.');
console.log('\n✅ Escaneo completado.');
