import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { projects } from '../lib/projects';

(async () => {
  console.log('Starting screenshot captures...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  // 16:9 aspect ratio at 1080p
  await page.setViewport({ width: 1920, height: 1080 });

  for (const project of projects) {
    if (!project.url) {
      console.warn(`Skipping ${project.name}: No URL provided.`);
      continue;
    }

    console.log(`\nNavigating to ${project.name}: ${project.url}`);
    
    try {
      await page.goto(project.url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
      
      console.log('Waiting 10 seconds for page to stabilize...');
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Replace extension with webp if it's png
      const imagePath = project.image.replace(/\.png$/, '.webp');
      const fullPath = path.join(process.cwd(), 'public', imagePath.startsWith('/') ? imagePath : `/${imagePath}`);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 16:9 capture (not full page) with WebP format
      await page.screenshot({ 
        path: fullPath, 
        type: 'webp',
        quality: 85
      });
      console.log(`Successfully saved: ${imagePath}`);
    } catch (error) {
      console.error(`Error capturing ${project.name}:`, error instanceof Error ? error.message : error);
    }
  }

  await browser.close();
  console.log('\nAll screenshots completed!');
})();