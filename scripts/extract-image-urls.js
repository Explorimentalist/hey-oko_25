#!/usr/bin/env node
/**
 * Extract Image URLs Script
 * 
 * This script extracts all image URLs from the home-sequence.md file
 * and generates a TypeScript file with the fallback images array.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MARKDOWN_FILE = path.join(process.cwd(), 'content/projects/home-sequence.md');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/fallbackImages.ts');

// Read the markdown file
console.log(`Reading markdown file: ${MARKDOWN_FILE}`);
const markdownContent = fs.readFileSync(MARKDOWN_FILE, 'utf8');

// Extract all image URLs using regex
const imageUrlRegex = /https:\/\/res\.cloudinary\.com\/[^"'\s]+/g;
const imageUrls = markdownContent.match(imageUrlRegex);

console.log(`Found ${imageUrls.length} image URLs`);

// Generate the TypeScript file content
const tsContent = `/**
 * Fallback image URLs for the home page sequence
 * These are used when Tina CMS fails to load the images
 * 
 * AUTOMATICALLY GENERATED - DO NOT EDIT MANUALLY
 * Generated on: ${new Date().toISOString()}
 * Total images: ${imageUrls.length}
 */

export const fallbackImages = [
${imageUrls.map(url => `  '${url}',`).join('\n')}
];

/**
 * Function to get a subset of fallback images
 * This is useful for performance optimization when you don't need all ${imageUrls.length} images
 * @param count Number of images to return
 * @param startIndex Starting index (default: 0)
 * @returns Array of image URLs
 */
export function getFallbackImages(count: number = 50, startIndex: number = 0): string[] {
  return fallbackImages.slice(startIndex, startIndex + count);
}
`;

// Write the TypeScript file
console.log(`Writing TypeScript file: ${OUTPUT_FILE}`);
fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf8');

console.log('Done! ✅'); 