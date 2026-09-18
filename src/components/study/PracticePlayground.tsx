"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const TEMPLATES = {
  javascript: {
    template: "vanilla" as const,
    files: {
      "/index.js": `// Practice JavaScript here
console.log("Hello from study practice");

function sum(a, b) {
  return a + b;
}

document.getElementById("app").textContent = "2 + 3 = " + sum(2, 3);
`,
      "/index.html": `<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script src="/index.js"></script>
  </body>
</html>
`,
    },
  },
  react: {
    template: "react" as const,
    files: {
      "/App.js": `export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>React practice</h1>
      <p>Edit this component and see it update live.</p>
    </div>
  );
}
`,
    },
  },
  "html-css": {
    template: "static" as const,
    files: {
      "/index.html": `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="card">
      <h1>HTML / CSS practice</h1>
      <p>Style this card in styles.css</p>
    </main>
  </body>
</html>
`,
      "/styles.css": `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f1f5f9;
}

.card {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}
`,
    },
  },
};

export function PracticePlayground({
  env = "javascript",
}: {
  env?: "javascript" | "react" | "html-css";
}) {
  const config = TEMPLATES[env] || TEMPLATES.javascript;

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)]">
      <SandpackProvider
        template={config.template}
        theme="light"
        files={config.files}
        options={{
          recompileMode: "delayed",
          recompileDelay: 400,
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor style={{ height: 320 }} showLineNumbers />
          <SandpackPreview style={{ height: 320 }} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
