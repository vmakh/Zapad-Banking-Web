const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const css = fs.readFileSync('src/styles/theme.css', 'utf8');
const tokens = name => [...css.matchAll(new RegExp(`--${name}:\\s*(#[a-f0-9]{6,8});`, 'gi'))].map(match => match[1]);
const rgba = hex => [...[1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255),hex.length===9?parseInt(hex.slice(7,9),16)/255:1];
const composite = (front, back) => front.slice(0,3).map((v,i) => v*front[3]+back[i]*(1-front[3]));
const luminance = rgb => rgb.slice(0,3).reduce((sum,v,i) => sum+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4),0);
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);

test('secondary text and positive values remain readable on both workspace canvases', () => {
  for (const ink of [...tokens('bank-muted'), ...tokens('bank-positive-ink')]) {
    for (const background of ['#f4f7fb','#eeeae3','#ffffff']) {
      assert.ok(contrast(rgba(ink),rgba(background))>=4.5,`${ink} on ${background} must meet WCAG 1.4.3`);
    }
  }
});

test('field boundaries and card identity badges retain accessible contrast', () => {
  tokens('bank-control-line').forEach((line,i) => {
    const background=tokens('bank-field')[i];
    assert.ok(contrast(rgba(line),rgba(background))>=3,`${line} on ${background} must meet WCAG 1.4.11`);
  });
  const ink=rgba(tokens('bank-card-ink')[0]);
  const badge=rgba(tokens('bank-card-state')[0]);
  for (const background of ['#3266a3','#996c50','#73868c']) {
    assert.ok(contrast(ink,composite(badge,rgba(background)))>=4.5,`Card badge on ${background} must meet WCAG 1.4.3`);
  }
});

test('semantic status text remains readable on its own notice and badge surface', () => {
  for (const tone of ['success','warning','attention','info','danger']) {
    const surface = tokens(`bank-status-${tone}-surface`)[0];
    const ink = tokens(`bank-status-${tone}-ink`)[0] ?? (tone === 'danger' ? tokens('bank-error')[0] : undefined);
    assert.ok(surface && ink, `${tone} must resolve both semantic colour roles`);
    assert.ok(contrast(rgba(ink),rgba(surface))>=4.5, `${tone} text must meet WCAG 1.4.3 on its own surface`);
  }
});
