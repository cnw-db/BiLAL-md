const { cmd } = require('../command')
const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')

cmd({
  pattern: 'fbdl',
  alias: ['fb', 'facebookdl'],
  desc: 'Download Facebook videos',
  category: 'downloader',
  filename: __filename
}, async (conn, m, { args }) => {
  if (!args[0]) return m.reply('📌 Use: .fbdl <facebook_url>')

  m.reply('⬇️ Downloading...')

  try {
    const url = args[0]
    const payload = qs.stringify({ fb_url: url })

    const res = await axios.post('https://saveas.co/smart_download.php', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(res.data)
    const hd = $('#hdLink').attr('href') || null
    const sd = $('#sdLink').attr('href') || null
    const video = hd || sd

    if (!video) return m.reply('❌ Failed to fetch video link.')

    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: `✅ *Facebook Video Downloader*\nQuality: ${hd ? 'HD' : 'SD'}`
    }, { quoted: m })

  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
  }
})
