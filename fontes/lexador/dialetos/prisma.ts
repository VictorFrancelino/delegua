import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/prisma';

export const PrismaConfig: DialetoLexador = {
    palavrasReservadas: palavrasReservadas,
    simbolosEspeciais: {
        '(': 'PARENTESE_ESQUERDO',
        ')': 'PARENTESE_DIREITO',
        '{': 'CHAVE_ESQUERDA',
        '}': 'CHAVE_DIREITA',
        ',': 'VIRGULA',
        '.': 'PONTO',
        ';': 'PONTO_E_VIRGULA',
        '-': 'SUBTRACAO',
        '+': 'ADICAO',
        '*': 'MULTIPLICACAO',
        '/': 'DIVISAO',
    }
    // O Prisma normalmente usa a lógica de comparação padrão (==, !=, etc.)
    // Se não houver símbolos compostos exóticos, não precisas de hooks.
};