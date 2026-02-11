import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/tenda';

export const TendaConfig: DialetoLexador = {
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
    // O Tenda geralmente não necessita de hooks customizados,
    // pois utiliza a lógica de símbolos compostos (==, !=, <=, >=) padrão do motor.
};