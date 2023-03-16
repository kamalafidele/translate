const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cors = require('cors');
const axios = require('axios');

dotenv.config();
const app = express();
const { RAPID_API_KEY, HOST, PORT = 4500 } = process.env;

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: '*',
    credentials: false,
}));

app.post('/api/v1/translate', async (req, res) => {
    const { text, to, from } = req.body;
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.append("q", text);
        encodedParams.append("target", to);
        encodedParams.append("source", from);

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept-Encoding': 'application/gzip',
              'X-RapidAPI-Key': `${RAPID_API_KEY}`,
              'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: encodedParams
          };
        
        const { data: { data: { translations } } } = await axios.request(options);

        return res.status(200).json({ translated: translations[0].translatedText });
    } catch (e) {
        console.log('error: ', e);
        return res.status(500).json({ error: e });
    }
});

app.use((req, res) => res.status(404).json({ error: 'We  cannot get what you are looking for!!' }));

app.listen(PORT, () => {
    console.log(`APP RUNNING ON ${HOST}:${PORT}`);
});