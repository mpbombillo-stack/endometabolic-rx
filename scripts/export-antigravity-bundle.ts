/**
 * Script de exportación de código para Antigravity Agent (Google @google/genai)
 * Genera el paquete completo de fuentes inline para inicializar o clonar en el sandbox de Antigravity.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

interface InlineSource {
  type: 'inline';
  target: string;
  content: string;
}

const ROOT_DIR = process.cwd();

// Archivos y directorios a excluir
const EXCLUDE_PATHS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'bun.lock',
  'antigravity-bundle.json',
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
      // Filtrar archivos binarios pesados o temporales
      if (!entry.name.endsWith('.png') && !entry.name.endsWith('.jpg') && !entry.name.endsWith('.lock')) {
        fileList.push(relPath);
      }
    }
  }

  return fileList;
}

export function buildAntigravityBundle() {
  const files = getAllFiles(ROOT_DIR);
  const sources: InlineSource[] = [];

  for (const relPath of files) {
    try {
      const content = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf-8');
      sources.push({
        type: 'inline',
        target: relPath.startsWith('/') ? relPath : `/${relPath}`,
        content,
      });
    } catch (err) {
      console.warn(`No se pudo leer ${relPath}:`, err);
    }
  }

  const bundle = {
    $schema: 'https://developer.google.com/genai/schemas/antigravity-agent.json',
    id: 'endometabolic-rx-functional-care',
    name: 'EndoMetabolic Rx - Functional Care CDSS',
    version: '1.0.0',
    description: 'Sistema de Soporte para Decisiones Clínicas en Medicina Funcional y Diagnóstico de Resistencia a la Insulina',
    base_agent: 'antigravity-preview-09-2026',
    metadata: {
      exported_at: new Date().toISOString(),
      file_count: sources.length,
      platform: 'Google GenAI Antigravity Managed Agent',
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
      sources,
    },
    tools: [
      { type: 'code_execution' },
      { type: 'google_search' },
      { type: 'url_context' },
    ],
  };

  const outputPath = path.join(ROOT_DIR, 'antigravity-bundle.json');
  fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2), 'utf-8');

  console.log(`✅ Bundle de Antigravity exportado con éxito a: ${outputPath}`);
  console.log(`📦 Archivos empaquetados: ${sources.length}`);
  return bundle;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildAntigravityBundle();
}
