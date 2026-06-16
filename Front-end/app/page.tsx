'use client';

import { useState } from 'react';

// IMPORTANTE: Altere o número da porta (5001, 7123, etc.) para coincidir exatamente 
// com a URL HTTPS que o seu terminal do .NET ('dotnet run') exibiu.
const API_URL = 'http://localhost:5190/api/calculadora';

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<'investimento' | 'financiamento' | 'imovel'>('investimento');

  // Estados para a aba Investimento
  const [valorInicial, setValorInicial] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [valorResgate, setValorResgate] = useState('');
  const [dataResgate, setDataResgate] = useState('');
  const [resultadoInvestimento, setResultadoInvestimento] = useState<any>(null);

  // Estados para a aba Financiamento
  const [valorParcela, setValorParcela] = useState('');
  const [taxaFinanciamento, setTaxaFinanciamento] = useState('');
  const [totalParcelas, setTotalParcelas] = useState('');
  const [resultadoFinanciamento, setResultadoFinanciamento] = useState<number | null>(null);

  // Estados para a aba Imóvel
  const [tipoImovel, setTipoImovel] = useState('casa');
  const [valorMetro, setValorMetro] = useState('');
  const [area, setArea] = useState('');
  const [quartos, setQuartos] = useState('');
  const [andar, setAndar] = useState('0');
  const [valorPorAndar, setValorPorAndar] = useState('0');
  const [resultadoImovel, setResultadoImovel] = useState<any>(null);

  // Função para chamar o endpoint de Investimento do .NET
  const calcularInvestimento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/investimento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valorInicial: parseFloat(valorInicial),
          taxaJuros: parseFloat(taxaJuros) / 100,
          dataInicio: new Date(dataInicio).toISOString(),
          dataFim: new Date(dataFim).toISOString(),
          valorResgate: valorResgate ? parseFloat(valorResgate) : 0,
          dataResgate: dataResgate ? new Date(dataResgate).toISOString() : null,
        }),
      });
      const data = await res.json();
      setResultadoInvestimento(data);
    } catch (err) {
      alert('Erro ao conectar com a API .NET. Certifique-se de que o backend está rodando no terminal.');
    }
  };

  // Função para chamar o endpoint de Financiamento (Valor Presente)
  const calcularFinanciamento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/financiamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valorParcela: parseFloat(valorParcela),
          taxaJuros: parseFloat(taxaFinanciamento) / 100,
          totalParcelas: parseInt(totalParcelas),
        }),
      });
      const data = await res.json();
      setResultadoFinanciamento(data.valorPresente);
    } catch (err) {
      alert('Erro ao conectar com a API .NET.');
    }
  };

  // Função para chamar o endpoint de Avaliação de Imóvel
  const calcularImovel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/imovel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoImovel: tipoImovel === 'apartamento' ? 'sim' : 'não',
          valorMetro: parseFloat(valorMetro),
          area: parseFloat(area),
          quartos: parseInt(quartos),
          andar: parseInt(andar),
          valorPorAndar: parseFloat(valorPorAndar),
        }),
      });
      const data = await res.json();
      setResultadoImovel(data);
    } catch (err) {
      alert('Erro ao conectar com a API .NET.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Sistema Multi-Calculadoras Financeiras
        </h1>

        {/* Abas Superiores de Navegação */}
        <div className="flex justify-center gap-4 mb-8">
          {(['investimento', 'financiamento', 'imovel'] as const).map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${abaAtiva === aba
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
            >
              {aba === 'investimento' && 'Investimento'}
              {aba === 'financiamento' && 'Financiamento'}
              {aba === 'imovel' && 'Avaliação de Imóvel'}
            </button>
          ))}
        </div>

        {/* Card Onde Ficam os Formulários */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">

          {/* 1. SEÇÃO: INVESTIMENTO */}
          {abaAtiva === 'investimento' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Calculadora de Investimentos</h2>
              <form onSubmit={calcularInvestimento} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor Inicial (R$)</label>
                  <input type="number" step="any" required className="w-full border p-2 rounded" value={valorInicial} onChange={(e) => setValorInicial(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Taxa de Juros Mensal (%)</label>
                  <input type="number" step="any" required className="w-full border p-2 rounded" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Início</label>
                  <input type="date" required className="w-full border p-2 rounded" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data Final</label>
                  <input type="date" required className="w-full border p-2 rounded" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                </div>
                <div className="border-t border-gray-100 pt-2 md:col-span-2">
                  <span className="text-sm font-semibold text-gray-400 block mb-2">Simulação de Resgate Antecipado (Opcional)</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor do Resgate (R$)</label>
                  <input type="number" step="any" className="w-full border p-2 rounded" value={valorResgate} onChange={(e) => setValorResgate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data do Resgate</label>
                  <input type="date" className="w-full border p-2 rounded" value={dataResgate} onChange={(e) => setDataResgate(e.target.value)} />
                </div>
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-2">
                  Calcular Rendimentos e Gerar Extrato
                </button>
              </form>

              {resultadoInvestimento && (
                <div className="mt-8 border-t pt-6">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                    <span className="text-sm font-medium text-green-700 block">Valor Final Líquido Estimado:</span>
                    <h3 className="text-2xl font-bold text-green-900 mt-1">
                      {resultadoInvestimento.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                  </div>

                  <h4 className="text-md font-bold mb-3 text-gray-700">Extrato Detalhado do Período</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-100 text-left text-xs uppercase tracking-wider text-gray-600 border-b border-gray-200">
                          <th className="p-3">Período</th>
                          <th className="p-3">Rendimento</th>
                          <th className="p-3">Renda Acum.</th>
                          <th className="p-3">Resgate</th>
                          <th className="p-3">Saldo Restante</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100">
                        {resultadoInvestimento.extrato.map((linha: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium text-gray-900">{linha.periodo}</td>
                            <td className="p-3 text-green-600 font-medium">+{linha.rendimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="p-3 text-gray-600">{linha.rendaAcumulada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="p-3 font-medium text-red-500">
                              {linha.resgate > 0 ? `-${linha.resgate.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : 'R$ 0,00'}
                            </td>
                            <td className="p-3 font-semibold text-gray-900">{linha.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. SEÇÃO: FINANCIAMENTO */}
          {abaAtiva === 'financiamento' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Financiamento (Cálculo de Valor Presente)</h2>
              <form onSubmit={calcularFinanciamento} className="flex flex-col gap-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor da Parcela Mensal (R$)</label>
                  <input type="number" step="any" required className="w-full border p-2 rounded" value={valorParcela} onChange={(e) => setValorParcela(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Taxa de Juros do Financiamento (% a.m.)</label>
                  <input type="number" step="any" required className="w-full border p-2 rounded" value={taxaFinanciamento} onChange={(e) => setTaxaFinanciamento(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total de Parcelas (Quantidade de Meses)</label>
                  <input type="number" required className="w-full border p-2 rounded" value={totalParcelas} onChange={(e) => setTotalParcelas(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Calcular Valor Presente
                </button>
              </form>

              {resultadoFinanciamento !== null && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md">
                  <p className="text-sm text-blue-700 font-medium">O valor financiado equivalente hoje (Valor Presente do contrato) é:</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">
                    {resultadoFinanciamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </h3>
                </div>
              )}
            </div>
          )}

          {/* 3. SEÇÃO: IMÓVEL */}
          {abaAtiva === 'imovel' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Avaliação do Valor de Imóvel</h2>
              <form onSubmit={calcularImovel} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">O imóvel é um apartamento?</label>
                  <select className="w-full border p-2 rounded bg-white" value={tipoImovel} onChange={(e) => setTipoImovel(e.target.value)}>
                    <option value="casa">Não (É uma Casa / Terreno)</option>
                    <option value="apartamento">Sim (É um Apartamento)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor do Metro Quadrado na Região (R$)</label>
                  <input type="number" step="any" required className="w-full border p-2 rounded" value={valorMetro} onChange={(e) => setValorMetro(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Área Total do Imóvel (m²)</label>
                  <input type="number" step="any" required className="w-full border p-2 rounded" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantidade Total de Quartos</label>
                  <input type="number" required className="w-full border p-2 rounded" value={quartos} onChange={(e) => setQuartos(e.target.value)} />
                </div>

                {tipoImovel === 'apartamento' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Andar do Apartamento</label>
                      <input type="number" className="w-full border p-2 rounded" value={andar} onChange={(e) => setAndar(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Valor Adicional por Andar (R$)</label>
                      <input type="number" step="any" className="w-full border p-2 rounded" value={valorPorAndar} onChange={(e) => setValorPorAndar(e.target.value)} />
                    </div>
                  </>
                )}

                <button type="submit" className="md:col-span-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-2">
                  Avaliar Preço de Venda e Aluguel
                </button>
              </form>

              {resultadoImovel && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-semibold uppercase tracking-wider">Valor Estimado de Venda:</p>
                    <h3 className="text-xl font-bold text-green-900 mt-1">
                      {resultadoImovel.valorVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold uppercase tracking-wider">Sugestão de Aluguel Mensal (1%):</p>
                    <h3 className="text-xl font-bold text-purple-900 mt-1">
                      {resultadoImovel.valorAluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}