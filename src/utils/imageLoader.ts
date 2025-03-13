/**
 * Image loading utility functions to optimize performance
 */

// Maximum number of concurrent image loads
const MAX_CONCURRENT_LOADS = 5;

// Track active loads
let activeLoads = 0;
let imageLoadQueue: (() => void)[] = [];

/**
 * Load an image with concurrency control
 * This prevents too many simultaneous image requests, which can block network and UI
 */
export function loadImageControlled(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const startLoad = () => {
      activeLoads++;
      
      const img = new Image();
      
      const onLoadComplete = () => {
        activeLoads--;
        // Start next queued load if available
        if (imageLoadQueue.length > 0) {
          const nextLoad = imageLoadQueue.shift();
          if (nextLoad) nextLoad();
        }
      };
      
      img.onload = () => {
        onLoadComplete();
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        // Try with CORS setting
        img.crossOrigin = "anonymous";
        
        // Add second error handler
        img.onerror = () => {
          console.error(`Failed to load image even with CORS: ${src}`);
          onLoadComplete();
          resolve(img); // Resolve anyway to not break the animation
        };
        
        // Try loading again
        img.src = src;
      };
      
      img.src = src;
    };
    
    // If under max concurrent loads, start immediately, otherwise queue
    if (activeLoads < MAX_CONCURRENT_LOADS) {
      startLoad();
    } else {
      imageLoadQueue.push(startLoad);
    }
  });
}

/**
 * Preload high priority images immediately
 * Call this for the first few frames to ensure they load immediately
 */
export function preloadPriorityImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(src => {
    const img = new Image();
    img.src = src;
    return new Promise<HTMLImageElement>(resolve => {
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error(`Failed to preload priority image: ${src}`);
        resolve(img); // Resolve anyway to not break the sequence
      };
    });
  }));
}

/**
 * Calculate optimal batch size based on network conditions
 */
export function getAdaptiveBatchSize(initialBatchSize: number): number {
  // Get the network information if available
  if ('connection' in navigator && navigator.connection) {
    const connection = navigator.connection as any;
    
    // Adjust batch size based on connection type
    if (connection.effectiveType === '4g' && !connection.saveData) {
      return initialBatchSize;
    } else if (connection.effectiveType === '3g') {
      return Math.max(3, Math.floor(initialBatchSize / 2));
    } else {
      // 2g or slow connection
      return Math.max(2, Math.floor(initialBatchSize / 3));
    }
  }
  
  return initialBatchSize;
} 