import test from 'node:test';
import assert from 'node:assert/strict';
import {certificateData} from '../dist/certificate.js';
test('certificate requires eleven completed tasks and unlocked exit',()=>{assert.throws(()=>certificateData('王小明',10,true));assert.throws(()=>certificateData('王小明',11,false));assert.equal(certificateData('王小明',11,true).name,'王小明')});
test('certificate validates names and preserves multilingual display names',()=>{assert.throws(()=>certificateData('  ',11,true));assert.throws(()=>certificateData('王'.repeat(25),11,true));assert.equal(certificateData('  林小明  Alex  ',11,true).name,'林小明 Alex')});
test('certificate date uses Taiwan calendar day and remains stable when reopened',()=>{const data=certificateData('陳同學',11,true,'2026-10-26T18:30:00Z');assert.equal(data.date,'2026年10月27日');assert.equal(data.issuedAt,'2026-10-26T18:30:00Z')});
