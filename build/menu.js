"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
// ๐ ๐ ๐ฎ 
function show({ owner, insta, prefix }, nome) {
    return `โ โ๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐
โ โ๐๐๐๐ ๐ฝ๐ฃ๐๐ฅ๐ซ BOT ๐
โ โ๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐๐
โ โโโโโโโโโโโโโโโ
โ   
โ \t\t\tOlรก ${nome}!
โ \t\t\tBEM VINDO AO MENU
โ   
โ โโ  Crรฉditos ๐ค 
โ   
โ              By: ${owner}
โ          Insta: ${insta}
โ   
โ โโ  Comandos ๐ฎ
โ   
โ    ใ  Abrir o menu
โ    ${prefix}menu
โ 
โ    ใ  Diga oi ao bot,
โ    ele nunca te pediu nada
โ    ${prefix}oi
โ   
โ โโ  Bugs ๐
โ   
โ    ใ  Para reportar bugs
โ    entre em contato pelo
โ    link abaixo:
โ    https://wa.me/5562986316077
โ   
โ โโโโโโโโโโโโโโโ
    `;
}
exports.default = show;
