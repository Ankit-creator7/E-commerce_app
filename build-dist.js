import fs from 'fs';
import path from 'path';

// Clean or create dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// Copy frontend/dist into root dist
if (fs.existsSync('frontend/dist')) {
  fs.cpSync('frontend/dist', 'dist', { recursive: true });
  console.log('✓ Copied frontend build to dist/');
} else {
  console.error('frontend/dist not found!');
}

// Copy admin/dist into root dist/admin
if (fs.existsSync('admin/dist')) {
  fs.mkdirSync('dist/admin', { recursive: true });
  fs.cpSync('admin/dist', 'dist/admin', { recursive: true });
  console.log('✓ Copied admin build to dist/admin/');
} else {
  console.error('admin/dist not found!');
}
