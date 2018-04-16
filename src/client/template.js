export default ({ body }) => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Wheater Filter</title>
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>
        <div id="root">${body}</div>
        <script type="text/javascript" src="/client.js"></script>
      </body>
    </html>
  `;
};