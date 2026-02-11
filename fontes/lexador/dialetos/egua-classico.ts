import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/egua-classico';

export const EguaClassicoConfig: DialetoLexador = {
    palavrasReservadas: palavrasReservadas,
    simbolosEspeciais: {
        '(': 'PARENTESE_ESQUERDO',
        ')': 'PARENTESE_DIREITO',
        '{': 'CHAVE_ESQUERDA',
        '}': 'CHAVE_DIREITA',
        ',': 'VIRGULA',
        '.': 'PONTO',
        '-': 'SUBTRACAO',
        '+': 'ADICAO',
        '*': 'MULTIPLICACAO',
        '/': 'DIVISAO',
        ';': 'PONTO_E_VIRGULA',
    }
};