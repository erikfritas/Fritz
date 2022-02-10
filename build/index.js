"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const pino_1 = __importDefault(require("pino"));
const fs = __importStar(require("fs"));
const Msgs = __importStar(require("./msgs"));
const menu_1 = __importDefault(require("./menu"));
const msgs = Msgs.msgs;
const config = JSON.parse(fs.readFileSync('./src/config.json', { encoding: 'utf8' }));
const debugId = '556286316077-1600830393@g.us';
function connectToWhatsApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const { state, saveState } = (0, baileys_1.useSingleFileAuthState)('./auth_info_multi.json', (0, pino_1.default)({ level: "debug" }));
        const sock = (0, baileys_1.default)({
            // can provide additional config here
            auth: state,
            printQRInTerminal: true,
            logger: (0, pino_1.default)({ level: "warn" })
        });
        sock.ev
            .on('creds.update', saveState)
            .on('connection.update', (update) => {
            var _a, _b;
            const { connection, lastDisconnect } = update;
            if (connection === 'close' && lastDisconnect) {
                const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
                if (shouldReconnect)
                    connectToWhatsApp();
            }
            else if (connection === 'open')
                msgs['conn']();
        })
            .on('messages.upsert', m => {
            //console.log(JSON.stringify(m, undefined, 2))
            //await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' })
            var _a;
            const msg = ((_a = m.messages[0].message) === null || _a === void 0 ? void 0 : _a.conversation) || '';
            const id = m.messages[0].key.remoteJid || 'desconhecido 404';
            const nome = m.messages[0].pushName || 'sem nome 404';
            if (msg && msg[0] === config.prefix) {
                const cmd = msg.substring(1);
                const cmds = {
                    menu: () => __awaiter(this, void 0, void 0, function* () {
                        sock.sendMessage(id, { text: (0, menu_1.default)(config, nome) });
                    }),
                    oi: () => __awaiter(this, void 0, void 0, function* () {
                        const opa = 'oops, não vi vc aí, oi';
                        const frases = [
                            'olá, como vai?', 'fala meu jovem', 'fala ze',
                            'que oi que nada, meu nome é ze pikeno',
                            'que oi crocante, meu nome é ze pikante',
                            'opa, fala meu jovem',
                            '"... tem cheiro suvaco de alemão e tal...", ' + opa,
                            '"... vira, agora é minha vez...", ' + opa,
                            '"... caraio que cheiro de transeunte...", ' + opa,
                            '"... tá aqui no meu cu c quer ver?...", ' + opa,
                            '"... e ainda tinha cara de paiaço kkk...", ' + opa,
                            '"... cala boca sua paiaça...", ' + opa,
                            '"... cala boca sua palafita...", ' + opa,
                            '"... cala boca sua bananuda...", ' + opa,
                            '"... falei pro c, é cara de um cuzinho do outro...", ' + opa
                        ];
                        sock.sendMessage(id, { text: frases[Math.floor(Math.random() * frases.length)] })
                            .then(() => msgs['sent'](msg, id, nome))
                            .catch(() => msgs['error sent'](msg, id, nome));
                    }),
                    // GAMES
                };
                if (Object.keys(cmds).includes(cmd))
                    Object(cmds)[cmd]();
                else
                    sock.sendMessage(id, { text: `ERRO: Comando inexistente` })
                        .then(() => msgs['error sent'](msg, id, nome));
            }
        });
    });
}
// run in main file
connectToWhatsApp();
