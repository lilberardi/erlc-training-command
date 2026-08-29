# ER:LC Training Command

Flow: `;start training` in ER:LC -> signed Event Webhook -> verify signature -> detect CustomCommand -> send `:m Training is starting! Please report to the training area.`

Render: Node; Build `npm install`; Start `npm start`; Environment variable `ERLC_SERVER_KEY` = your ER:LC private-server API key.

Webhook URL: `https://YOUR-RENDER-DOMAIN/erlc/webhook`

Keep the server key secret.
