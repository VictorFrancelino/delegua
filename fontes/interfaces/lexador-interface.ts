import { RetornoLexador } from './retornos/retorno-lexador';
import { SimboloInterface } from './simbolo-interface';

export interface LexadorInterface<T> {
    simbolos: SimboloInterface[];
    codigo: string | string[];
    inicioSimbolo: number;
    atual: number;
    linha: number;

    ehDigito(caractere: string): boolean;
    ehAlfabeto(caractere: string): boolean;
    ehAlfabetoOuDigito(caractere: string): boolean;
    ehFinalDoCodigo(): boolean;
    avancar(): string | void;
    adicionarSimbolo(tipo: any, literal: any): void;
    simboloAtual(): string;
    proximoSimbolo(): string;
    simboloAnterior(): string;
    analisarTexto(delimitador: string): void;
    analisarNumero(): void;
    identificarPalavraChave(): void;
    analisarToken(): void;
    mapear(codigo: string[], hashArquivo: number): RetornoLexador<T>;
}
