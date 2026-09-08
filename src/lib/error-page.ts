export function renderErrorPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Server Error — OpenGraph AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f1115; color: #f4f4f6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .container { text-align: center; max-width: 480px; padding: 24px; }
    h1 { font-size: 32px; margin: 0 0 12px; }
    p { color: #8a8f98; font-size: 14px; margin-bottom: 24px; }
    a { display: inline-block; background: #f4f4f6; color: #0f1115; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-weight: 500; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Server Error</h1>
    <p>An unexpected error occurred while rendering the page. Please try refreshing.</p>
    <a href="/">Return Home</a>
  </div>
</body>
</html>`;
}
