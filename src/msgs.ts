import 'colors'

export const msgs = {
    'conn': () => console.log('\n-=-= Opened Connection -=-=\n'.rainbow),
    'sent': (cmd: string, id: string, nome: string) =>
        console.log('*'.blue + ` comando ${cmd} { id: ${id}, nome: ${nome} }`.cyan),
    'error sent': (cmd: string, id: string, nome: string) =>
        console.log('*'.blue + ` ERRO: comando ${cmd} { id: ${id}, nome: ${nome} }`.red)
}
