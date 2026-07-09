#!/usr/bin/env node
"use strict";

// Scans the built book/ HTML for <task-item> and <quiz-question> tags and
// writes book/task-manifest.json — a flat list of every task/question in the
// book, used by the Progress page to show completed/total across all pages.
//
// Run this AFTER `mdbook build`:
//   mdbook build && node scripts/build-manifest.js

const fs = require("fs");
const path = require("path");

const BOOK_DIR = path.join(__dirname, "..", "book");
const OUTPUT_FILE = path.join(BOOK_DIR, "task-manifest.json");

// Must exactly match createId() in theme/question.js, so manifest ids line
// up with what PointsSystem stores in the "seen" set in localStorage.
function createQuestionId(questionText, answerText) {
  const combined = questionText.trim() + "::" + answerText.trim();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (Math.imul(31, hash) + combined.charCodeAt(i)) | 0;
  }
  return "q-" + Math.abs(hash).toString(36);
}

function parseAttrs(attrString) {
  const attrs = {};
  const re = /([\w-]+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(attrString)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function walk(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function scanFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const page = path.relative(BOOK_DIR, filePath).split(path.sep).join("/");
  const entries = [];

  const taskRe = /<task-item\s+([^>]*)>([\s\S]*?)<\/task-item>/g;
  let m;
  while ((m = taskRe.exec(html)) !== null) {
    const attrs = parseAttrs(m[1]);
    const text = decodeEntities(m[2].replace(/<[^>]*>/g, "").trim());
    if (!attrs.id) {
      console.warn(`Warning: <task-item> missing id on ${page}, skipping`);
      continue;
    }
    entries.push({
      type: "task",
      id: attrs.id,
      points: parseInt(attrs.points || "0", 10),
      text,
      page,
    });
  }

  const quizRe = /<quiz-question\s+([^>]*?)\/?>(?:<\/quiz-question>)?/g;
  while ((m = quizRe.exec(html)) !== null) {
    const attrs = parseAttrs(m[1]);
    if (!attrs.q || !attrs.a) continue;
    const q = decodeEntities(attrs.q);
    const a = decodeEntities(attrs.a);
    entries.push({
      type: "question",
      id: createQuestionId(q, a),
      points: parseInt(attrs.points || "0", 10),
      text: q,
      page,
    });
  }

  return entries;
}

function main() {
  if (!fs.existsSync(BOOK_DIR)) {
    console.error(`Error: ${BOOK_DIR} not found. Run "mdbook build" first.`);
    process.exit(1);
  }

  const files = walk(BOOK_DIR);
  let manifest = [];
  for (const file of files) {
    manifest = manifest.concat(scanFile(file));
  }

  const seenIds = new Set();
  manifest = manifest.filter((entry) => {
    if (seenIds.has(entry.id)) return false;
    seenIds.add(entry.id);
    return true;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifest.length} entries to ${OUTPUT_FILE}`);
}

main();