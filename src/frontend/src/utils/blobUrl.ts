/**
 * Utility functions for constructing blob URLs from asset IDs
 * and determining asset types based on MIME types.
 */

/**
 * Constructs a blob URL from an asset blob ID using the Internet Computer
 * canister HTTP endpoint pattern.
 * 
 * @param blobId - The blob ID from the media asset
 * @returns A URL string that can be used to access the blob via HTTP
 */
export function getBlobUrl(blobId: string): string {
  // Use the Internet Computer's HTTP interface pattern
  // The blob-storage mixin serves blobs via query parameter
  return `${window.location.origin}/?assetId=${encodeURIComponent(blobId)}`;
}

/**
 * Determines if a MIME type represents an image that can be displayed
 * in an <img> tag.
 * 
 * @param mimeType - The MIME type string (e.g., 'image/jpeg', 'application/pdf')
 * @returns true if the MIME type is an image format, false otherwise
 */
export function isImageMimeType(mimeType: string): boolean {
  const imageMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ];
  
  return imageMimeTypes.includes(mimeType.toLowerCase());
}

/**
 * Determines if a MIME type represents a PDF document.
 * 
 * @param mimeType - The MIME type string
 * @returns true if the MIME type is PDF, false otherwise
 */
export function isPdfMimeType(mimeType: string): boolean {
  return mimeType.toLowerCase() === 'application/pdf';
}
