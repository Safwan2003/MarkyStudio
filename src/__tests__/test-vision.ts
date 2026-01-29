/**
 * Test Vision Analysis
 * Quick test script to analyze the user's uploaded screenshots
 * Run: ts-node -r tsconfig-paths/register src/__tests__/test-vision.ts
 */

import { analyzeScreenshot } from '../lib/vision';
import { generateHTML, generateCSS } from '../lib/html-generator';
import path from 'path';

async function testVisionAnalysis() {
    try {
        console.log('🧪 Testing Vision Analysis with Llama 4 Scout...\n');

        // Use the user's uploaded screenshots
        const screenshotPath = path.join(
            __dirname,
            '../../.gemini/antigravity/brain/1cc68990-7cac-46ae-9a48-4718f36d4328/uploaded_media_0_1769500421359.png'
        );

        console.log(`📸 Analyzing: ${path.basename(screenshotPath)}`);

        const analysis = await analyzeScreenshot(screenshotPath);

        console.log('\n✅ Analysis Complete!\n');
        console.log('📊 Results:');
        console.log(`  - Layout Type: ${analysis.layout.type}`);
        console.log(`  - Elements Found: ${analysis.elements.length}`);
        console.log(`  - Interactions Suggested: ${analysis.interactions.length}`);
        console.log(`  - Color Palette: ${JSON.stringify(analysis.colorPalette, null, 2)}`);

        console.log('\n🔨 Generating HTML/CSS...');
        const html = generateHTML(analysis);
        const css = generateCSS(analysis);

        console.log('\n📝 Generated HTML (first 500 chars):');
        console.log(html.substring(0, 500));

        console.log('\n🎨 Generated CSS (first 500 chars):');
        console.log(css.substring(0, 500));

        console.log('\n✨ Test Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    }
}

testVisionAnalysis();
