import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const artifactDir = 'C:/Users/shrik/.gemini/antigravity/brain/788f7ff2-eb09-42fc-bb9a-2d6332d8362d';

async function main() {
  console.log('🚀 Starting Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Desktop Landing
  console.log('📸 1. Capturing Desktop Landing...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollBy(0, 300));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'landing-desktop.png') });

  // 2. Mobile Landing
  console.log('📸 2. Capturing Mobile Landing...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'landing-mobile.png') });

  // 3. Tablet Landing
  console.log('📸 3. Capturing Tablet Landing...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'landing-tablet.png') });

  // 4. WhatsApp Simulator (/demo)
  console.log('📸 4. Capturing WhatsApp Simulator...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/demo', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4500)); // wait for bot greeting & chips animation
  await page.screenshot({ path: path.join(artifactDir, 'demo-simulator.png') });

  // 5. Book Demo Form (/book-demo)
  console.log('📸 5. Capturing Book Demo Page...');
  await page.goto('http://localhost:3000/book-demo', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'book-demo.png') });

  // 6. Admin Login (/login)
  console.log('📸 6. Capturing Admin Login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'admin-login.png') });

  // 7. Dashboard Overview (/dashboard)
  console.log('📸 7. Capturing Dashboard Overview...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'dashboard-overview.png') });

  // 8. Appointments Register (/dashboard/appointments)
  console.log('📸 8. Capturing Appointments Register...');
  await page.goto('http://localhost:3000/dashboard/appointments', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'appointments-register.png') });

  // 9. 9 PM Daily Report Preview (/dashboard/reports)
  console.log('📸 9. Capturing 9 PM Daily Report Preview...');
  await page.goto('http://localhost:3000/dashboard/reports', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'daily-report.png') });

  await browser.close();
  console.log('✨ All 9 screenshots captured successfully!');
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
