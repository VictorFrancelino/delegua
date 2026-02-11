import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/portugol-ipt';

export const PortugolIptConfig: DialetoLexador = {
    palavrasReservadas: palavrasReservadas,
    simbolosEspeciais: {
        '(': 'PARENTESE_ESQUERDO',
        ')': 'PARENTESE_DIREITO',
        '[': 'COLCHETE_ESQUERDO',
        ']': 'COLCHETE_DIREITO',
        ',': 'VIRGULA',
        '.': 'PONTO',
        '-': 'SUBTRACAO',
        '+': 'ADICAO',
        '*': 'MULTIPLICACAO',
        '/': 'DIVISAO',
        '%': 'MODULO',
        '=': 'IGUAL',
        ':': 'DOIS_PONTOS'
    },
    hooks: {
        antesDeMapearCaractere: (lexador, caractere) => {
            // Trata o símbolo de atribuição <- exclusivo do Portugol-IPT/Calango
            if (caractere === '<') {
                lexador.avancar();
                if (lexador.simboloAtual() === '-') {
                    lexador.avancar();
                    lexador.adicionarSimbolo('SETINHA');
                    return true;
                }
                // Outras verificações como <= ou <>
                if (lexador.simboloAtual() === '=') {
                    lexador.avancar();
                    lexador.adicionarSimbolo('MENOR_IGUAL');
                    return true;
                }
                lexador.adicionarSimbolo('MENOR');
                return true;
            }
            return false;
        }
    }
};