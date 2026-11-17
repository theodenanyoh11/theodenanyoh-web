/**
 * URL for a plain <img>. S3 media already has an absolute URL.
 * Locally stored media has a path, which the browser resolves against the site.
 */
export const getMediaUrl = (url: string | null | undefined): string => url || ''
