namespace CalculadoraApi.Models
{
    public class FinanciamentoRequest
    {
        public double ValorParcela { get; set; }
        public double TaxaJuros { get; set; } // Ex: 0.01 para 1%
        public int TotalParcelas { get; set; }
    }

    public class FinanciamentoResponse
    {
        public double ValorPresente { get; set; }
    }
}