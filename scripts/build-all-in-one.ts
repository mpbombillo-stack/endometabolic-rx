/**
 * Generador de Archivo Único All-in-One para Google Antigravity
 * Produce `antigravity-all-in-one.js` (ejecutable autónomo) y `antigravity-standalone-manifest.json`
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT_DIR = process.cwd();

const EXCLUDE_PATHS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'bun.lock',
  'antigravity-bundle.json',
  'antigravity-all-in-one.js',
  'antigravity-standalone-manifest.json',
]);

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT_DIR, fullPath);

    if (EXCLUDE_PATHS.has(entry.name) || Array.from(EXCLUDE_PATHS).some(ex => relPath.startsWith(ex))) {
      continue;
    }

    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      if (!entry.name.endsWith('.png') && !entry.name.endsWith('.jpg') && !entry.name.endsWith('.lock')) {
        fileList.push(relPath);
      }
    }
  }

  return fileList;
}

export function generateAllInOne() {
  const files = getAllFiles(ROOT_DIR);
  const sourcesMap: Record<string, string> = {};
  const sourcesList: Array<{ type: 'inline'; target: string; content: string }> = [];

  for (const relPath of files) {
    try {
      const content = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf-8');
      const target = relPath.startsWith('/') ? relPath : `/${relPath}`;
      sourcesMap[target] = content;
      sourcesList.push({
        type: 'inline',
        target,
        content,
      });
    } catch (err) {
      console.warn(`Error leyendo ${relPath}:`, err);
    }
  }

  const agentConfig = {
    $schema: 'https://developer.google.com/genai/schemas/antigravity-agent.json',
    id: 'endometabolic-rx-functional-care',
    name: 'EndoMetabolic Rx - Functional Care CDSS',
    version: '1.0.0',
    description: 'Sistema de Soporte para Decisiones Clínicas en Medicina Funcional y Diagnóstico de Resistencia a la Insulina',
    base_agent: 'antigravity-preview-09-2026',
    metadata: {
      exported_at: new Date().toISOString(),
      file_count: sourcesList.length,
      platform: 'Google GenAI Antigravity Managed Agent',
      export_type: 'Single-File Standalone Bundle',
    },
    system_instruction:
      'Eres el agente clínico e ingeniero de software responsable de EndoMetabolic Rx - Functional Care. ' +
      'Tu entorno ejecuta un sandbox Linux con Node 22, React 19, Vite y Tailwind CSS v4. ' +
      'Mantén siempre la compatibilidad FHIR R4, las fórmulas metabólicas exactas (HOMA-IR, QUICKI, TyG, TyG-BMI, METS-IR, LAP, VAI, FLI), ' +
      'el sistema de 10 niveles del desafío clínico y la identidad visual de Functional Care.',
    base_environment: {
      type: 'remote',
      runtime: 'node22',
      workdir: '/workspace',
      ports: [3000],
      entrypoint: 'npm run dev',
      sources: sourcesList,
    },
    tools: [
      { type: 'code_execution' },
      { type: 'google_search' },
      { type: 'url_context' },
    ],
  };

  // Guardar archivo JSON único
  const jsonPath = path.join(ROOT_DIR, 'antigravity-all-in-one.json');
  fs.writeFileSync(jsonPath, JSON.stringify(agentConfig, null, 2), 'utf-8');

  // Construir script JS autónomo ejecutable
  const jsScript = `#!/usr/bin/env node
/**
 * ============================================================================
 * ENDOMETABOLIC RX - FUNCTIONAL CARE
 * ALL-IN-ONE STANDALONE FILE FOR GOOGLE ANTIGRAVITY (antigravity-preview-09-2026)
 * ============================================================================
 * 
 * Este archivo único contiene TODO el proyecto empaquetado (${sourcesList.length} archivos)
 * y la lógica para conectarse a Google Antigravity o extraer el código localmente.
 *
 * MODO 1: Desplegar en Antigravity
 *   export GEMINI_API_KEY="tu_clave_api"
 *   node antigravity-all-in-one.js
 *
 * MODO 2: Registrar como Agente Personalizado permanente
 *   node antigravity-all-in-one.js --register
 *
 * MODO 3: Extraer/Desempaquetar todo el código en el disco
 *   node antigravity-all-in-one.js --unpack ./mi-proyecto
 * ============================================================================
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// MANIFIESTO Y CÓDIGO FUENTE COMPLETO DEL PROYECTO
export const ANTIGRAVITY_CONFIG = ${JSON.stringify(agentConfig, null, 2)};

// ----------------------------------------------------------------------------
// FUNCIÓN 1: Desempaquetar localmente
// ----------------------------------------------------------------------------
export function unpackProject(destDir = './endometabolic-rx') {
  console.log(\`📦 Desempaquetando \${ANTIGRAVITY_CONFIG.base_environment.sources.length} archivos en \${destDir}...\`);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const file of ANTIGRAVITY_CONFIG.base_environment.sources) {
    const cleanRelPath = file.target.replace(/^\\//, '');
    const fullPath = path.join(destDir, cleanRelPath);
    const dirName = path.dirname(fullPath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.content, 'utf-8');
  }

  console.log('✅ Desempaquetado exitoso.');
  console.log(\`Para arrancar localmente:\\n  cd \${destDir}\\n  npm install\\n  npm run dev\\n\`);
}

// ----------------------------------------------------------------------------
// FUNCIÓN 2: Desplegar o Invocar en Google Antigravity (@google/genai)
// ----------------------------------------------------------------------------
export async function runInAntigravity(registerPermanent = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('\\n❌ Error: La variable de entorno GEMINI_API_KEY no está configurada.');
    console.error('Por favor configúrala con: export GEMINI_API_KEY="tu_api_key"\\n');
    process.exit(1);
  }

  let GoogleGenAI;
  try {
    const mod = await import('@google/genai');
    GoogleGenAI = mod.GoogleGenAI;
  } catch (err) {
    console.error('\\n❌ Error: El paquete @google/genai no está instalado en este entorno.');
    console.error('Ejecuta: npm install @google/genai\\n');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  if (registerPermanent) {
    console.log('🚀 Creando Custom Agent permanente en Google GenAI...');
    const agent = await ai.agents.create({
      id: ANTIGRAVITY_CONFIG.id,
      base_agent: ANTIGRAVITY_CONFIG.base_agent,
      system_instruction: ANTIGRAVITY_CONFIG.system_instruction,
      base_environment: ANTIGRAVITY_CONFIG.base_environment,
    });
    console.log(\`✅ Custom Agent registrado con éxito! ID: \${agent.id}\`);
    return agent;
  }

  console.log('🚀 Lanzando Sandbox Remoto en Google Antigravity (antigravity-preview-09-2026)...');
  console.log(\`📡 Montando \${ANTIGRAVITY_CONFIG.base_environment.sources.length} archivos fuente en el sandbox...\`);

  const interaction = await ai.interactions.create(
    {
      agent: ANTIGRAVITY_CONFIG.base_agent,
      input:
        'Inicia el entorno de EndoMetabolic Rx - Functional Care. ' +
        'Ejecuta "npm run build" y "npm run lint", y comprueba que el servidor de telemetría y decisiones clínicas responda correctamente.',
      environment: ANTIGRAVITY_CONFIG.base_environment,
      tools: ANTIGRAVITY_CONFIG.tools,
    },
    { timeout: 300000 }
  );

  console.log(\`\\n📦 Sandbox Environment ID: \${interaction.environment_id}\`);
  console.log(\`📊 Estado de ejecución: \${interaction.status}\`);

  let fullOutput = '';
  if (interaction.steps) {
    for (const step of interaction.steps) {
      if (step.type === 'model_output' && step.content) {
        for (const item of step.content) {
          if (item.type === 'text' && 'text' in item && typeof item.text === 'string') {
            fullOutput += item.text;
          }
        }
      }
    }
  }

  console.log('\\n--- RESPUESTA DEL AGENTE ANTIGRAVITY ---');
  console.log(fullOutput || interaction.output_text);
  console.log('-----------------------------------------\\n');
  return interaction;
}

// ----------------------------------------------------------------------------
// CLI Entrypoint
// ----------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.includes('--unpack') || args.includes('-u')) {
  const destIndex = args.findIndex(a => a === '--unpack' || a === '-u') + 1;
  const targetDir = args[destIndex] && !args[destIndex].startsWith('-') ? args[destIndex] : './endometabolic-rx';
  unpackProject(targetDir);
} else if (args.includes('--register') || args.includes('-r')) {
  runInAntigravity(true).catch(console.error);
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(\`
Uso de antigravity-all-in-one.js:
  node antigravity-all-in-one.js                -> Despliega y ejecuta en Google Antigravity
  node antigravity-all-in-one.js --register     -> Registra el Custom Agent en Google GenAI
  node antigravity-all-in-one.js --unpack [dir] -> Extrae los archivos localmente
\`);
} else {
  // Ejecución por defecto
  runInAntigravity(false).catch(console.error);
}
`;

  const jsPath = path.join(ROOT_DIR, 'antigravity-all-in-one.js');
  fs.writeFileSync(jsPath, jsScript, 'utf-8');

  console.log(`✅ Archivo único JSON generado: ${jsonPath}`);
  console.log(`✅ Archivo único JS ejecutable generado: ${jsPath}`);
  console.log(`📦 Archivos empaquetados en un solo archivo: ${sourcesList.length}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllInOne();
}
