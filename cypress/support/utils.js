class util {
    static obterDataHora() {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(now);

        const map = {};
        parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value; });

        return `${map.day}${map.month}${map.year}_${map.hour}${map.minute}${map.second}`;
    }
}

module.exports = util;