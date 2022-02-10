"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgs = void 0;
require("colors");
exports.msgs = {
    'conn': () => console.log('\n-=-= Opened Connection -=-=\n'.rainbow),
    'sent': (cmd, id, nome) => console.log('*'.blue + ` comando ${cmd} { id: ${id}, nome: ${nome} }`.cyan),
    'error sent': (cmd, id, nome) => console.log('*'.blue + ` ERRO: comando ${cmd} { id: ${id}, nome: ${nome} }`.red)
};
