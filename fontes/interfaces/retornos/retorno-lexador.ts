import { Localizacao } from '../../lexador/dialetos/localizacao';
import { ErroLexador } from '../../lexador/interfaces/erro-lexador';

export interface RetornoLexador<T> {
    simbolos: T[];
    erros: ErroLexador[];
    pragmas?: { [linha: number]: Localizacao };
}
