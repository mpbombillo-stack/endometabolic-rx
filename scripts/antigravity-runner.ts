/**
 * Antigravity Agent Invocation Script
 * Uses @google/genai SDK Interactions API with antigravity-preview-09-2026
 */
import { GoogleGenAI } from '@google/genai';

async function runAntigravityAgent() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is required.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log('Invocando Antigravity Agent (antigravity-preview-09-2026)...');

  try {
    const interaction = await ai.interactions.create(
      {
        agent: 'antigravity-preview-09-2026',
        input:
          'Inicia el entorno de EndoMetabolic Rx - Functional Care. ' +
          'Verifica la compilación con "npm run build", ejecuta el linting con "npm run lint", ' +
          'y comprueba que el servidor de telemetría y decisiones clínicas responda correctamente.',
        environment: 'remote',
        tools: [
          { type: 'code_execution' },
          { type: 'google_search' },
          { type: 'url_context' },
        ],
      },
      { timeout: 300000 }
    );

    console.log(`Environment ID: ${interaction.environment_id}`);
    console.log(`Status: ${interaction.status}`);

    // Iterate through all model_output steps
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

    console.log('Resultado del Antigravity Agent:');
    console.log(fullOutput || interaction.output_text);
  } catch (error) {
    console.error('Error al ejecutar Antigravity Agent:', error);
  }
}

if (process.argv[1] && process.argv[1].endsWith('antigravity-runner.ts')) {
  runAntigravityAgent();
}

export { runAntigravityAgent };
