# ER:LC Training Command

Render-ready starter.

Intended flow:
ER:LC `;start training` -> Event Webhook -> this service -> ER:LC `:m Training is starting!`

Render:
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variable: `ERLC_SERVER_KEY` = your private-server API key

After deployment, the webhook endpoint is:
`https://YOUR-RENDER-DOMAIN/erlc/webhook`

Do not put your server key in the source code or send it to anyone.

Verify the current ER:LC API endpoint/webhook format against the official ER:LC API documentation before production use.
