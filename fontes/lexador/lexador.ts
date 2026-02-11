import hrtime from 'browser-process-hrtime';
import { LexadorInterface, SimboloInterface } from '../interfaces';
import { RetornoLexador } from '../interfaces/retornos/retorno-lexador';
import { DialetoLexador } from './interfaces/dialeto-lexador';
import { Simbolo } from './simbolo';
import { ErroLexador } from './interfaces/erro-lexador';
import { DeleguaConfig } from './dialetos/delegua';

export class Lexador implements LexadorInterface<SimboloInterface> {
    codigo: string[];
    hashArquivo: number;
    simbolos: SimboloInterface[];
    erros: ErroLexador[];
    localizacoes: { [linha: number]: any };

    inicioSimbolo: number;
    atual: number;
    linha: number;
    performance: boolean;

    private dialeto: DialetoLexador;

    constructor(dialeto: DialetoLexador = DeleguaConfig, performance = false) {
        this.dialeto = dialeto;
        this.performance = performance;
        this.simbolos = [];
        this.erros = [];
        this.localizacoes = {};
    }

    avancar(): string | void {
        this.atual++;

        if (this.ehFinalDaLinha() && !this.ehUltimaLinha()) {
            this.linha++;
            this.atual = 0;

            this.dialeto.hooks?.aoIniciarNovaLinha?.(this);
        }
    }

    simboloAtual(): string {
        return this.ehFinalDaLinha() ? '\0' : this.codigo[this.linha].charAt(this.atual);
    }

    proximoSimbolo(): string {
        return (this.atual + 1 >= this.codigo[this.linha].length) ? '\0' : this.codigo[this.linha].charAt(this.atual + 1);
    }

    simboloAnterior(): string {
        return this.codigo[this.linha].charAt(this.atual - 1);
    }

    ehFinalDaLinha(): boolean {
        return this.atual >= this.codigo[this.linha].length;
    }

    ehUltimaLinha(): boolean {
        return this.linha >= this.codigo.length - 1;
    }

    ehFinalDoCodigo(): boolean {
        return this.ehUltimaLinha() && this.ehFinalDaLinha();
    }

    ehDigito(caractere: string): boolean {
        return caractere >= '0' && caractere <= '9';
    }

    ehAlfabeto(caractere: string): boolean {
        if (this.dialeto.hooks?.validadorAlfabeto) {
            return this.dialeto.hooks.validadorAlfabeto(caractere);
        }

        return (caractere >= 'a' && caractere <= 'z') ||
            (caractere >= 'A' && caractere <= 'Z') ||
            caractere === '_';
    }

    ehAlfabetoOuDigito(caractere: string): boolean {
        return this.ehAlfabeto(caractere) || this.ehDigito(caractere);
    }

    adicionarSimbolo(tipo: any, literal: any = null): void {
        const texto: string = this.codigo[this.linha].substring(this.inicioSimbolo, this.atual);

        this.simbolos.push(new Simbolo(
            tipo,
            texto,
            literal,
            this.linha + 1,
            this.hashArquivo,
            this.inicioSimbolo + 1,
            this.atual
        ));
    }

    analisarTexto(delimitador: string, ehInterpolacao: boolean = false): void {
        this.avancar();

        let valor = '';

        while (this.simboloAtual() !== delimitador && !this.ehFinalDoCodigo()) {
            valor += this.simboloAtual();
            this.avancar();
        }

        if (this.ehFinalDoCodigo()) {
            this.erros.push({ linha: this.linha + 1, mensagem: 'Texto não finalizado.' } as ErroLexador);
            return;
        }

        const tipo = ehInterpolacao ? (this.dialeto.simbolosEspeciais.INTERPOLACAO || 'TEXTO') : 'TEXTO';
        this.adicionarSimbolo(tipo, valor);
    }

    analisarNumero(): void {
        while (this.ehDigito(this.simboloAtual())) {
            this.avancar();
        }

        if (this.simboloAtual() === '.' && this.ehDigito(this.proximoSimbolo())) {
            this.avancar();

            while (this.ehDigito(this.simboloAtual())) {
                this.avancar();
            }
        }

        const numeroTexto = this.codigo[this.linha].substring(this.inicioSimbolo, this.atual);
        this.adicionarSimbolo('NUMERO', parseFloat(numeroTexto));
    }

    identificarPalavraChave(): void {
        while (this.ehAlfabeto(this.simboloAtual()) || this.ehDigito(this.simboloAtual())) {
            this.avancar();
        }

        const lexema = this.codigo[this.linha].substring(this.inicioSimbolo, this.atual);

        // Pergunta ao dialeto se essa palavra é reservada
        const tipo = lexema in this.dialeto.palavrasReservadas
            ? this.dialeto.palavrasReservadas[lexema]
            : 'IDENTIFICADOR';

        this.adicionarSimbolo(tipo);
    }

    analisarToken(): void {
        const caractere = this.simboloAtual();

        if (this.dialeto.hooks?.antesDeMapearCaractere?.(this, caractere)) return;

        if (this.dialeto.simbolosEspeciais[caractere]) {
            this.adicionarSimbolo(this.dialeto.simbolosEspeciais[caractere]);
            this.avancar();
            return;
        }

        switch (caractere) {
            case ' ':
            case '\t':
            case '\r':
            case '\n':
                this.avancar();
                break;
            case '"':
            case "'":
                this.analisarTexto(caractere);
                this.avancar();
                break;
            default:
                if (this.ehDigito(caractere)) this.analisarNumero();
                else if (this.ehAlfabeto(caractere)) this.identificarPalavraChave();
                else {
                    this.erros.push({
                        linha: this.linha + 1,
                        caractere,
                        mensagem: 'Caractere inesperado.'
                    } as ErroLexador);
                    this.avancar();
                }
        }
    }

    mapear(codigo: string[], hashArquivo: number): RetornoLexador<SimboloInterface> {
        const inicioMapeamento: [number, number] = hrtime();

        this.erros = [];
        this.simbolos = [];
        this.localizacoes = {};
        this.linha = 0;
        this.atual = 0;
        this.codigo = codigo || [''];
        this.hashArquivo = hashArquivo;

        this.dialeto.hooks?.aoIniciarNovaLinha?.(this);

        while (!this.ehFinalDoCodigo()) {
            this.inicioSimbolo = this.atual;
            this.analisarToken();
        }

        if (this.performance) {
            const delta = hrtime(inicioMapeamento);
            console.log(`[Lexador] Tempo: ${delta[0] * 1e9 + delta[1]}ns`);
        }

        return {
            simbolos: this.simbolos,
            erros: this.erros,
            pragmas: this.localizacoes,
        } as RetornoLexador<SimboloInterface>;
    }
}