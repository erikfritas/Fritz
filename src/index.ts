import makeWASocket, { DisconnectReason, BufferJSON, useSingleFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'
import * as fs from 'fs'
import * as Msgs from './msgs'
import menu from './menu'

const msgs = Msgs.msgs

const config = JSON.parse(fs.readFileSync('./src/config.json', {encoding: 'utf8'}))

const debugId = '556286316077-1600830393@g.us'

async function connectToWhatsApp () {
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json', P({ level: "warn" }))
    const sock = makeWASocket({
        // can provide additional config here
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "warn"})
    })

    sock.ev
    .on('creds.update', saveState)

    .on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close' && lastDisconnect) {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if(shouldReconnect) connectToWhatsApp()
        } else if(connection === 'open') msgs['conn']()
    })

    .on('messages.upsert', m => {
        //console.log(JSON.stringify(m, undefined, 2))
        //await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })

        const msg: string = m.messages[0].message?.conversation || ''

        const id = m.messages[0].key.remoteJid || 'desconhecido 404'
        const nome = m.messages[0].pushName || 'sem nome 404'

        if (msg && msg[0] === config.prefix) {
            const cmd: string = msg.substring(1)
            const cmds = {
                menu: async () => {
                    sock.sendMessage(id, { text: menu(config, nome) })
                    .then(() => msgs['sent'](msg, id, nome))
                    .catch(() => msgs['error sent'](msg, id, nome))
                },
                oi: async () => {
                    const opa = 'oops, não vi vc aí, oi'
                    const frases = [
                        'olá, como vai?', 'fala meu jovem', 'fala ze',
                        'que oi que nada, meu nome é ze pikeno',
                        'que oi crocante, meu nome é ze pikante',
                        'opa, fala meu jovem',
                        '"... tem cheiro suvaco de alemão e tal...", '+opa,
                        '"... vira, agora é minha vez...", '+opa,
                        '"... caraio que cheiro de transeunte...", '+opa,
                        '"... tá aqui no meu cu c quer ver?...", '+opa,
                        '"... e ainda tinha cara de paiaço kkk...", '+opa,
                        '"... cala boca sua paiaça...", '+opa,
                        '"... cala boca sua palafita...", '+opa,
                        '"... cala boca sua bananuda...", '+opa,
                        '"... falei pro c, é cara de um cuzinho do outro...", '+opa
                    ];
                    sock.sendMessage(id,
                    { text: frases[Math.floor(Math.random() * frases.length)] })
                    .then(() => msgs['sent'](msg, id, nome))
                    .catch(() => msgs['error sent'](msg, id, nome))
                },
                // GAMES
                
            }

            if (Object.keys(cmds).includes(cmd))
                Object(cmds)[cmd]()
            else
                sock.sendMessage(id, { text: `ERRO: Comando inexistente` })
                .then(() => msgs['error sent'](msg, id, nome))
        }
    })
}
// run in main file
connectToWhatsApp()
