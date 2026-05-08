const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const USERNAME = process.env.GITHUB_USERNAME || 'taosin';
const OUTPUT_DIR = path.join(__dirname, '..', 'assets');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 定义要生成的图片配置
const images = [
  {
    name: 'github-stats',
    url: `https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=onedark&hide_border=true`,
  },
  {
    name: 'top-langs',
    url: `https://github-readme-stats.vercel.app/api/top-langs?username=${USERNAME}&layout=donut&theme=onedark&hide_border=true`,
  },
  {
    name: 'streak-stats',
    url: `https://github-readme-streak-stats.herokuapp.com/?user=${USERNAME}&theme=dark&hide_border=true`,
  },
];

function downloadImage(url, outputPath) {
  console.log(`Downloading: ${path.basename(outputPath)}...`);
  try {
    execSync(`curl -s -o "${outputPath}" "${url}"`, { stdio: 'inherit' });
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      console.log(`Saved: ${outputPath}`);
      return true;
    } else {
      console.error(`Failed to download: ${url}`);
      return false;
    }
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return false;
  }
}

function main() {
  console.log(`Generating stats images for user: ${USERNAME}`);
  
  let successCount = 0;
  for (const image of images) {
    const outputPath = path.join(OUTPUT_DIR, `${image.name}.png`);
    if (downloadImage(image.url, outputPath)) {
      successCount++;
    }
  }
  
  console.log(`\nDone! ${successCount}/${images.length} images generated successfully.`);
}

main();
