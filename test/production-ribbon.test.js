const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(root, "production-ribbon.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

function run(origin) {
  const elements = new Map();
  const children = [];
  const document = {
    getElementById: (id) => elements.get(id),
    createElement: (tagName) => ({
      tagName,
      attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      attachShadow() {
        this.shadowChildren = [];
        return { append: (...nodes) => this.shadowChildren.push(...nodes) };
      },
    }),
    documentElement: {
      append(element) {
        children.push(element);
        elements.set(element.id, element);
      },
    },
  };
  const context = vm.createContext({ window: { location: { origin } }, document });
  vm.runInContext(script, context);
  return { children, context };
}

test("content script is scoped to the exact HTTPS production origin", () => {
  assert.deepEqual(manifest.content_scripts[0].matches, ["https://taskly.iy0306.com/*"]);
  for (const origin of ["http://taskly.iy0306.com", "https://dev.taskly.iy0306.com", "https://taskly.iy0306.com.evil.test"]) {
    assert.equal(run(origin).children.length, 0);
  }
});

test("production page receives one accessible ribbon", () => {
  const { children, context } = run("https://taskly.iy0306.com");
  assert.equal(children.length, 1);
  assert.equal(children[0].attributes["aria-label"], "本番環境");
  assert.equal(children[0].shadowChildren[1].textContent, "本番環境");
  vm.runInContext(script, context);
  assert.equal(children.length, 1);
});
