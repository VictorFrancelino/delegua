export interface DialetoLexador {
    palavrasReservadas: { [palavra: string]: any };

    simbolosEspeciais: { [caractere: string]: any };

    hooks?: {
        aoIniciarNovaLinha?: (lexador: any) => void;
        antesDeMapearCaractere?: (lexador: any, caractere: string) => boolean;
        aoEncontrarFinalDeLinha?: (lexador: any) => void;
        identificarPalavraChaveCustomizada?: (lexador: any, palavra: string) => any;
        validadorAlfabeto?: (caractere: string) => boolean;
    };
}