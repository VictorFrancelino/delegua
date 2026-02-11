import { DialetoLexador } from '../interfaces/dialeto-lexador';
import { palavrasReservadas } from '../palavras-reservadas/pitugues';
import tiposDeSimbolos from '../../tipos-de-simbolos/pitugues';

export const PituguesConfig: DialetoLexador = {
    palavrasReservadas: palavrasReservadas,
    simbolosEspeciais: {
        ':': tiposDeSimbolos.DOIS_PONTOS,
        '(': tiposDeSimbolos.PARENTESE_ESQUERDO,
        ')': tiposDeSimbolos.PARENTESE_DIREITO,
        '[': tiposDeSimbolos.COLCHETE_ESQUERDO,
        ']': tiposDeSimbolos.COLCHETE_DIREITO,
        '{': tiposDeSimbolos.CHAVE_ESQUERDA,
        '}': tiposDeSimbolos.CHAVE_DIREITA,
        ',': tiposDeSimbolos.VIRGULA,
        '.': tiposDeSimbolos.PONTO,
        ';': tiposDeSimbolos.PONTO_E_VIRGULA,
        '%': tiposDeSimbolos.MODULO,
        '~': tiposDeSimbolos.BIT_NOT,
        '&': tiposDeSimbolos.BIT_AND,
        '|': tiposDeSimbolos.BIT_OR,
        '^': tiposDeSimbolos.BIT_XOR,
    },
    hooks: {
        aoIniciarNovaLinha: (lexador) => {
            let espacos = 0;
            while (['\t', ' '].includes(lexador.simboloAtual()) && !lexador.eFinalDoCodigo()) {
                espacos++;
                lexador.avancar();
            }

            lexador.localizacoes[lexador.linha + 1] = {
                linha: lexador.linha + 1,
                espacosIndentacao: espacos,
            };
        },
        antesDeMapearCaractere: (lexador, caractere) => {
            switch (caractere) {
                case '#':
                    lexador.avancar();

                    const linhaAtual = lexador.linha;

                    while (linhaAtual === lexador.linha && !lexador.eFinalDoCodigo()) {
                        lexador.avancar();
                    }

                    return true;

                case 'f':
                case 'F':
                    if (['"', "'"].includes(lexador.proximoSimbolo())) {
                        lexador.avancar(); // consome f

                        const delimitador = lexador.simboloAtual();

                        lexador.avancar(); // consome aspa
                        lexador.analisarTexto(delimitador, true); // true indica interpolação
                        lexador.avancar(); // aspa final

                        return true;
                    }

                    return false; // Se não for f"", deixa o motor tratar como palavra normal

                case '/': // Divisão Inteira // vs Divisão Comum /
                    lexador.avancar();
                    if (lexador.simboloAtual() === '/') {
                        lexador.adicionarSimbolo(tiposDeSimbolos.DIVISAO_INTEIRA);
                        lexador.avancar();
                    } else if (lexador.simboloAtual() === '=') {
                        lexador.adicionarSimbolo(tiposDeSimbolos.DIVISAO_IGUAL);
                        lexador.avancar();
                    } else {
                        lexador.adicionarSimbolo(tiposDeSimbolos.DIVISAO);
                    }
                    return true;

                case '*': // Exponenciação ** vs Multiplicação *
                    lexador.avancar();
                    if (lexador.simboloAtual() === '*') {
                        lexador.adicionarSimbolo(tiposDeSimbolos.EXPONENCIACAO);
                        lexador.avancar();
                    } else if (lexador.simboloAtual() === '=') {
                        lexador.adicionarSimbolo(tiposDeSimbolos.MULTIPLICACAO_IGUAL);
                        lexador.avancar();
                    } else {
                        lexador.adicionarSimbolo(tiposDeSimbolos.MULTIPLICACAO);
                    }
                    return true;

                case '-': // Seta -> vs Subtração -
                    lexador.avancar();
                    if (lexador.simboloAtual() === '>') {
                        lexador.adicionarSimbolo(tiposDeSimbolos.SETA);
                        lexador.avancar();
                    } else if (lexador.simboloAtual() === '=') {
                        lexador.adicionarSimbolo(tiposDeSimbolos.MENOS_IGUAL);
                        lexador.avancar();
                    } else {
                        lexador.adicionarSimbolo(tiposDeSimbolos.SUBTRACAO);
                    }
                    return true;

                default:
                    return false; // Não é um caso especial, motor segue o fluxo padrão
            }
        },
        validadorAlfabeto: (caractere) => {
            const acentuacoes = ['á', 'é', 'í', 'ó', 'ú', 'ã', 'õ', 'â', 'ê', 'î', 'ô', 'û', 'à', 'ç', '_'];

            return (caractere >= 'a' && caractere <= 'z') ||
                (caractere >= 'A' && caractere <= 'Z') ||
                acentuacoes.includes(caractere.toLowerCase());
        }
    }
};

export default PituguesConfig;