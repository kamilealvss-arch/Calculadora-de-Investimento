using Microsoft.AspNetCore.Mvc;
using CalculadoraApi.Models;
using System;
using System.Collections.Generic;

namespace CalculadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalculadoraController : ControllerBase
    {
        // 1. ENDPOINT: INVESTIMENTO
        [HttpPost("investimento")]
        public ActionResult<InvestimentoResponse> CalcularInvestimento([FromBody] InvestimentoRequest request)
        {
            var response = new InvestimentoResponse();
            int meses = 0;
            DateTime dataSimulada = request.DataInicio;

            while (dataSimulada.AddMonths(1) <= request.DataFim)
            {
                meses++;
                dataSimulada = dataSimulada.AddMonths(1);
            }

            int mesResgate = -1;
            if (request.DataResgate.HasValue)
            {
                mesResgate = ((request.DataResgate.Value.Year - request.DataInicio.Year) * 12) 
                             + (request.DataResgate.Value.Month - request.DataInicio.Month) + 1;
            }

            double presente = request.ValorInicial;
            double rendaAcumulada = 0;

            for (int m = 1; m <= meses; m++)
            {
                double rendimentoMes = presente * request.TaxaJuros;
                presente += rendimentoMes;
                rendaAcumulada += rendimentoMes;

                double resgateAplicado = 0;
                if (m == mesResgate && request.ValorResgate > 0 && presente >= request.ValorResgate)
                {
                    resgateAplicado = request.ValorResgate;
                    presente -= resgateAplicado;
                }

                response.Extrato.Add(new ExtratoMensal
                {
                    Periodo = $"Mês {m}",
                    TaxaJuros = request.TaxaJuros,
                    Rendimento = rendimentoMes,
                    RendaAcumulada = rendaAcumulada,
                    Resgate = resgateAplicado,
                    Saldo = presente
                });
            }

            int diasRestantes = (request.DataFim - dataSimulada).Days;
            if (diasRestantes > 0)
            {
                double taxaDiaria = request.TaxaJuros / 30.0;
                double rendimentoDias = presente * taxaDiaria * diasRestantes;
                presente += rendimentoDias;
                rendaAcumulada += rendimentoDias;

                response.Extrato.Add(new ExtratoMensal
                {
                    Periodo = $"+{diasRestantes} Dias",
                    TaxaJuros = taxaDiaria,
                    Rendimento = rendimentoDias,
                    RendaAcumulada = rendaAcumulada,
                    Resgate = 0,
                    Saldo = presente
                });
            }

            response.ValorFinal = presente;
            return Ok(response);
        }

        // 2. ENDPOINT: VALOR PRESENTE (Financiamento - Parcelas Iguais)
        [HttpPost("financiamento")]
        public ActionResult<FinanciamentoResponse> CalcularFinanciamento([FromBody] FinanciamentoRequest request)
        {
            // Fórmula do Valor Presente de uma Anuidade: VP = P * [(1 - (1 + i)^-n) / i]
            double taxa = request.TaxaJuros;
            int n = request.TotalParcelas;
            
            double valorPresente = request.ValorParcela * ((1 - Math.Pow(1 + taxa, -n)) / taxa);

            return Ok(new FinanciamentoResponse { ValorPresente = Math.Round(valorPresente, 2) });
        }

        // 3. ENDPOINT: AVALIAÇÃO DE IMÓVEL
        [HttpPost("imovel")]
        public ActionResult<ImovelResponse> CalcularImovel([FromBody] ImovelRequest request)
        {
            double valorExtraAndar = 0;

            if (request.TipoImovel.ToLower() == "sim" || request.TipoImovel.ToLower() == "apartamento")
            {
                valorExtraAndar = request.Andar * request.ValorPorAndar;
            }

            double valorVenda = (request.Area * request.ValorMetro) + valorExtraAndar;

            if (request.Quartos > 4)
            {
                valorVenda *= 1.10;
            }

            double valorAluguel = valorVenda * 0.01;

            return Ok(new ImovelResponse 
            { 
                ValorVenda = Math.Round(valorVenda, 2), 
                ValorAluguel = Math.Round(valorAluguel, 2) 
            });
        }
    }
}