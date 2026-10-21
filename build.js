import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- Starting Unified E-Commerce Build ---');

// 1. Build Frontend
console.log('\n[1/3] Building Customer Frontend...');
execSync('npm install', { cwd: 'frontend', stdio: 'inherit' });
execSync('npm run build', { cwd: 'frontend', stdio: 'inherit' });

// 2. Build Admin
console.log('\n[2/3] Building Admin Dashboard...');
execSync('npm install', { cwd: 'admin', stdio: 'inherit' });
execSync('npm run build', { cwd: 'admin', stdio: 'inherit' });

// 3. Install Backend Dependencies
console.log('\n[3/3] Preparing Backend Dependencies...');
execSync('npm install', { cwd: 'backend', stdio: 'inherit' });

// 4. Assemble output into root `dist/`
console.log('\nAssembling unified dist directory...');
const rootDist = path.resolve('dist');
const frontendDist = path.resolve('frontend/dist');
const adminDist = path.resolve('admin/dist');

if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}

fs.cpSync(frontendDist, rootDist, { recursive: true });

const rootAdminDist = path.join(rootDist, 'admin');
fs.cpSync(adminDist, rootAdminDist, { recursive: true });

console.log('\n--- Unified Build Complete! ---');
console.log('Customer Storefront -> dist/index.html');
console.log('Admin Dashboard     -> dist/admin/index.html');
