import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/guarani';

export const GuaraniConfig: DialetoLexador = {
    palavrasReservadas: palavrasReservadas,
    simbolosEspeciais: {
        '(': 'PARENTESE_ESQUERDO',
        ')': 'PARENTESE_DIREITO',
        '[': 'COLCHETE_ESQUERDO',
        ']': 'COLCHETE_DIREITO',
        '{': 'CHAVE_ESQUERDA',
        '}': 'CHAVE_DIREITA',
        ',': 'VIRGULA',
        '.': 'PONTO',
        '-': 'SUBTRACAO',
        '+': 'ADICAO',
        '*': 'MULTIPLICACAO',
        '/': 'DIVISAO',
        '%': 'MODULO',
        '=': 'IGUAL',
        ':': 'DOIS_PONTOS',
        ';': 'PONTO_E_VIRGULA'
    }
};