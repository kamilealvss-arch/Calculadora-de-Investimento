using System;
using System.Collections.Generic;

namespace CalculadoraApi.Models
{
    public class InvestimentoRequest
    {
        public double ValorInicial { get; set; }
        public double TaxaJuros { get; set; } // 
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public double ValorResgate { get; set; }
        public DateTime? DataResgate { get; set; }
    }

    public class ExtratoMensal
    {
        public string Periodo { get; set; } = string.Empty;
        public double TaxaJuros { get; set; }
        public double Rendimento { get; set; }
        public double RendaAcumulada { get; set; }
        public double Resgate { get; set; }
        public double Saldo { get; set; }
    }

    public class InvestimentoResponse
    {
        public double ValorFinal { get; set; }
        public List<ExtratoMensal> Extrato { get; set; } = new List<ExtratoMensal>();
    }
}