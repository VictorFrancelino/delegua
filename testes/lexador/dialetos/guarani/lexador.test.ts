import { Lexador } from '../../../../fontes/lexador';
import { GuaraniConfig } from '../../../../fontes/lexador/dialetos';

import tiposDeSimbolos from '../../../../fontes/tipos-de-simbolos/guarani';

describe('Lexador', () => {
    describe('mapear()', () => {
        let lexador: Lexador;

        beforeEach(() => {
            lexador = new Lexador(GuaraniConfig);
        });

        describe('Cenários de sucesso', () => {
            it('Sucesso - Código vazio', () => {
                const resultado = lexador.mapear([''], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(0);
            });

            it('Sucesso - Ponto-e-vírgula, opcional', () => {
                const resultado = lexador.mapear([';;;;;;;;;;;;;;;;;;;;;'], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(0);
            });

            it('Sucesso - Olá guaranis', () => {
                const resultado = lexador.mapear(["hai('Olá guaranis')"], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(4);
                expect(resultado.simbolos).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ tipo: tiposDeSimbolos.HAI }),
                        expect.objectContaining({ tipo: tiposDeSimbolos.PARENTESE_ESQUERDO }),
                        expect.objectContaining({ tipo: tiposDeSimbolos.TEXTO }),
                        expect.objectContaining({ tipo: tiposDeSimbolos.PARENTESE_DIREITO }),
                    ])
                );
            });
        });
    });
});
