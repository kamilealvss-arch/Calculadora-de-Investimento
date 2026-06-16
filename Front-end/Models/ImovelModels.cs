namespace CalculadoraApi.Models
{
    public class ImovelRequest
    {
        public string TipoImovel { get; set; } = "casa"; 
        public double ValorMetro { get; set; }
        public double Area { get; set; }
        public int Quartos { get; set; }
        public int Andar { get; set; }
        public double ValorPorAndar { get; set; }
    }

    public class ImovelResponse
    {
        public double ValorVenda { get; set; }
        public double ValorAluguel { get; set; }
    }
}