#!/usr/bin/env node

/**
 * Build script for WebGL2 2D Graphics Library
 * Generates UMD and minified distributions
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
}

console.log('📦 Building Rastersonance library...\n');

// Read all source files
const colors = fs.readFileSync(path.join(SRC_DIR, 'colors.js'), 'utf-8');
const math = fs.readFileSync(path.join(SRC_DIR, 'math.js'), 'utf-8');
const graphics2d = fs.readFileSync(path.join(SRC_DIR, 'graphics2d.js'), 'utf-8');

// Create UMD bundle
const umdBundle = `
(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Global
        global.WebGL2D = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // Colors Module
    ${colors.replace(/export /g, '').replace(/default export/, 'const Colors =')}

    // Math Module
    ${math.replace(/export /g, '').replace(/export default/, 'const Math =')}

    // Graphics2D Module
    ${graphics2d.replace(/import.*from.*\n/g, '').replace(/export class Graphics2D/g, 'class Graphics2D').replace(/export default Graphics2D;/g, '')}

    return {
        Graphics2D,
        Vec2: Math.Vec2,
        Mat3: Math.Mat3,
        Color: Colors,
        Colors: Colors.predefined,
        VERSION: '1.0.0'
    };
}));
`;

// Write UMD bundle
const umdPath = path.join(DIST_DIR, 'rastersonance.js');
fs.writeFileSync(umdPath, umdBundle.replace(/global\.WebGL2D/g, 'global.Rastersonance'));
console.log('✅ Created:', umdPath);

// Create minified version (basic minification)
const minified = umdBundle
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\n\s+/g, '\n') // Remove excess whitespace
    .replace(/\n+/g, '\n');

const minPath = path.join(DIST_DIR, 'rastersonance.min.js');
fs.writeFileSync(minPath, minified.replace(/global\.WebGL2D/g, 'global.Rastersonance'));
console.log('✅ Created:', minPath);

console.log('\n✨ Build complete!');
console.log('\nDistribution files:');
console.log('  - dist/rastersonance.js (UMD)');
console.log('  - dist/rastersonance.min.js (minified)');
