import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/calango';

export const CalangoConfig: DialetoLexador = {
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
            if (caractere === '<') {
                lexador.avancar();
                if (lexador.simboloAtual() === '-') {
                    lexador.avancar();
                    lexador.adicionarSimbolo('SETINHA');
                    return true;
                }
                if (lexador.simboloAtual() === '=') {
                    lexador.avancar();
                    lexador.adicionarSimbolo('MENOR_IGUAL');
                    return true;
                }
                lexador.adicionarSimbolo('MENOR');
                return true;
            }

            if (caractere === '>') {
                lexador.avancar();
                if (lexador.simboloAtual() === '=') {
                    lexador.avancar();
                    lexador.adicionarSimbolo('MAIOR_IGUAL');
                    return true;
                }
                if (lexador.simboloAtual() === '<') {
                    lexador.avancar();
                    lexador.adicionarSimbolo('DIFERENTE');
                    return true;
                }
                lexador.adicionarSimbolo('MAIOR');
                return true;
            }

            return false;
        }
    }
};