import * as cors from 'cors';
import * as express from 'express';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

const app = express();
app.use(cors({ origin: true }));

/**
 * Creates a pass-through interface for fetching character information from DNDBeyond
 */
app.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send('Character id is required');
      return;
    }
    const response = await fetch(`https://character-service.dndbeyond.com/character/v4/character/${id}`, {});
    const { data, success } = await response.json();
    // eslint-disable-next-line no-throw-literal
    if (!success) throw { code: 400, message: data.serverMessage };
    res.send(data);
  } catch (e) {
    res.status(e.code).send(e);
  }
});
export const character = functions.https.onRequest(app);
