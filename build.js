#!/usr/bin/env node
/* Inlines src/app.js and the demo CSVs into a single self-contained index.html.
   Run:  node build.js                                                        */
const fs = require("fs");
const path = require("path");

const read = p => fs.readFileSync(path.join(__dirname, p), "utf8");

// A </script> anywhere inside inlined text would end the block early.
const safe = s => s.replace(/<\/script>/gi, "<\\/script>");

const html = read("src/index.template.html")
  .replace("/* __APP__ */", () => safe(read("src/app.js")))
  .replace("__DEMO_APPEARANCES__", () => safe(read("src/demo/karaite_appearances.csv")))
  .replace("__DEMO_PERSONS__", () => safe(read("src/demo/karaite_persons.csv")));

for (const marker of ["/* __APP__ */", "__DEMO_APPEARANCES__", "__DEMO_PERSONS__"]) {
  if (html.includes(marker)) {
    console.error("Placeholder was not replaced: " + marker);
    process.exit(1);
  }
}

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log(`index.html written — ${(html.length / 1024).toFixed(0)} KB`);
