#!/usr/bin/env node
/**
 * Cloudinary Image Sequence Fetcher
 * 
 * This script fetches all images from a specific folder in your Cloudinary account
 * using the Cloudinary SDK and updates your TinaCMS content file with the URLs.
 * 
 * Usage:
 * 1. Ensure your Cloudinary credentials are in your .env file
 * 2. Run: node scripts/fetch-cloudinary-images.js
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

// Configure cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration
const FOLDER_PATH = 'hey-oko25/home hero sequence';
const OUTPUT_FILE = path.join(process.cwd(), 'content/projects/home-sequence.md');
const MAX_RESULTS_PER_PAGE = 500; // Maximum allowed by Cloudinary API

// Add optimization configurations
const OPTIMIZATION_CONFIGS = {
  // Base configuration for all images
  base: {
    quality: 'auto',            // Auto-select optimal quality
    fetch_format: 'auto',       // Auto-select best format (WebP, AVIF)
    dpr: 'auto',                // Auto device pixel ratio
  },
  // Large screens
  desktop: {
    width: 1280,
    crop: 'fill',
  },
  // Medium screens (tablets)
  tablet: {
    width: 800,
    crop: 'fill',
  },
  // Small screens (mobile)
  mobile: {
    width: 480,
    crop: 'fill',
  }
};

// Helper function to build optimized Cloudinary URLs
function getOptimizedImageUrl(publicId, config = {}) {
  // Combine base optimization with specific config
  const transformations = {
    ...OPTIMIZATION_CONFIGS.base,
    ...config
  };
  
  // Use the transformations object directly with the cloudinary.url method
  // instead of converting it to a string with t_ prefix
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true
  });
}

async function fetchAllImagesFromCloudinary() {
  console.log(`Fetching all images from Cloudinary folder: ${FOLDER_PATH}...`);
  
  let allResources = [];
  let nextCursor = null;
  let page = 1;
  
  do {
    try {
      console.log(`Fetching page ${page}...`);
      // Get resources with pagination
      const result = await cloudinary.search
        .expression(`folder:${FOLDER_PATH}`)
        .sort_by('public_id', 'asc')
        .max_results(MAX_RESULTS_PER_PAGE)
        .next_cursor(nextCursor)
        .execute();
      
      console.log(`Found ${result.resources.length} images on page ${page}`);
      allResources = [...allResources, ...result.resources];
      nextCursor = result.next_cursor;
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page} from Cloudinary:`, error);
      throw error;
    }
  } while (nextCursor);
  
  console.log(`Total images found: ${allResources.length}`);
  return allResources;
}

async function generateMarkdownContent(images) {
  console.log('Generating markdown content...');
  
  // Extract the URLs and sort them by the sequence number in the filename
  const sortedImages = images
    .map(image => ({
      id: image.public_id,
      // Extract sequence number from filename
      sequenceNum: parseInt((image.public_id.match(/(\d+)(?=_[^_]*$)/) || ['0'])[0])
    }))
    .sort((a, b) => a.sequenceNum - b.sequenceNum);
  
  console.log(`Sorted ${sortedImages.length} images by sequence number`);
  
  // Create the YAML front matter
  let markdownContent = `---
title: Home Page Sequence
sequence:
`;

  // Add each image URL to the sequence with optimizations
  sortedImages.forEach((image, index) => {
    if (index % 100 === 0) {
      console.log(`Processing image ${index + 1}/${sortedImages.length}...`);
    }
    
    // Get optimized URL for responsive delivery
    const optimizedUrl = getOptimizedImageUrl(image.id, OPTIMIZATION_CONFIGS.desktop);
    
    markdownContent += `  - >-\n    ${optimizedUrl}\n`;
  });

  // Close the front matter and add description
  markdownContent += `---

# Home Page Sequence

This sequence provides the scrolling background animation for the home page hero section.

## Image Specifications

* Format: Auto-optimized (WebP/AVIF based on browser support)
* Quality: Auto-optimized
* Total Frames: ${sortedImages.length}

## Optimization Notes

Images are automatically optimized with:
- Responsive sizing based on device
- Automatic format selection (WebP/AVIF)
- Automatic quality optimization
- Automatic DPR (device pixel ratio) adjustment
`;

  return markdownContent;
}

async function updateTinaContent(markdownContent) {
  try {
    await fs.writeFile(OUTPUT_FILE, markdownContent, 'utf8');
    console.log(`Successfully updated ${OUTPUT_FILE} with ${markdownContent.split('\n').filter(line => line.includes('http')).length} image URLs`);
  } catch (error) {
    console.error('Error writing to markdown file:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting Cloudinary image fetch process...');
    
    // Fetch all images from Cloudinary
    const images = await fetchAllImagesFromCloudinary();
    
    // Generate the markdown content
    const markdownContent = await generateMarkdownContent(images);
    
    // Update the TinaCMS content file
    await updateTinaContent(markdownContent);
    
    console.log('Process completed successfully! ✅');
  } catch (error) {
    console.error('Process failed:', error);
    process.exit(1);
  }
}

// Run the script
main(); 