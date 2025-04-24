import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { WorkflowRequest } from './utils.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { id, type, data, member: { user } } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    if (name === 'submit') {
      const webhookRes = await WorkflowRequest({
        method: 'POST',
        body: JSON.stringify({
          type: 'submit',
          link: options[0].value,
          userId: user.id,
          username: user.username,
          displayName: user.global_name
        })
      });

      if (webhookRes.status === 200) {
        const webhookResData = await webhookRes.json();
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: webhookResData.message,
            flags: 64
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Something went wrong.',
            flags: 64
          }
        });
      }
    } else if (name === 'queue') {
      const webhookRes = await WorkflowRequest({
        method: 'POST',
        body: JSON.stringify({
          type: 'queue'
        })
      });

      if (webhookRes.status === 200) {
        const webhookResData = await webhookRes.json();
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: webhookResData.message?.reduce((acc, ele, i) => (
              `${acc}\n${i}. <@${ele.user}>: [${ele.link.split('.com/t/')[1].split('/')[0]}](${ele.link})`
            ), "") || 'Queue is empty!'
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Something went wrong.',
            flags: 64
          }
        });
      }
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
