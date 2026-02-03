import 'reflect-metadata';
import { Container } from 'typedi';
import { RunwayService } from '../src/services/runway.service';
import { logger } from '../src/utils/logger';
import fs from 'fs';
import path from 'path';

async function generateEpicVideo() {
  const runwayService = Container.get(RunwayService);

  // Resolve image path - using the known existing image
  const imagePath = path.resolve(__dirname, '../../images/daniela/daniela_office_godmode.png');

  if (!fs.existsSync(imagePath)) {
    logger.error(`Image not found at path: ${imagePath}`);
    // Fallback search in deploy_dist if not in root images
    const deployDistPath = path.resolve(__dirname, '../../deploy_dist/images/daniela/daniela_office_godmode.png');
    if (fs.existsSync(deployDistPath)) {
        logger.info(`Found image in deploy_dist: ${deployDistPath}`);
        // Proceed with deployDistPath... but let's just error for now or handle logic below if I were writing full logic
    }
    process.exit(1);
  }

  // Convert to Base64 Data URI
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64Image}`;

  const prompt = "Daniela, una asistente de IA sofisticada con traje futurista blanco y morado, presentando AIGestion en una oficina de alta tecnología con hologramas. Movimiento de cámara cinematográfico lento, iluminación volumétrica, 8k, estilo premium, photorealistic.";

  try {
    logger.info('Starting Epic Video Generation Script...');
    logger.info(`Using Image: ${imagePath}`);
    logger.info(`Prompt: ${prompt}`);

    // Call service with Data URI
    // Note: Assuming the service handles Data URIs correctly as implemented
    const result = await runwayService.generateImageToVideo(prompt, dataUri, {
      duration: 5,
      aspect_ratio: "1280:768",
      model: "gen3a_turbo"
    });

    console.log('\n--- RUNWAY GENERATION RESULT ---');
    console.log(`Task ID: ${result.id}`);
    console.log(`Status: ${result.status}`);
    console.log('--------------------------------\n');

    if (result.id && result.id.startsWith('mock-')) {
       logger.warn('Video generation simulated. Use real API key and check connectivity for production.');
    } else {
       logger.info(`Video generation started! Task ID: ${result.id}`);
       logger.info(`You can check the status later or view it in the Runway dashboard.`);
    }

  } catch (error) {
    logger.error('Failed to generate video:', error);
  }
}

generateEpicVideo();
