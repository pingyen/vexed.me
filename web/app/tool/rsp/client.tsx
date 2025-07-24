'use client';

import { useState } from 'react';
import Ad from '../../../components/ad';

interface CalculationResult {
  year: number;
  totalAmount: number;
  principal: number;
  interest: number;
}

export default function Client() {
  const [results, setResults] = useState<CalculationResult[]>([]);

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const elements = target.elements;

    const initialAmount = parseFloat((elements.namedItem('initialAmount') as HTMLInputElement).value);
    const periodicAmount = parseFloat((elements.namedItem('periodicAmount') as HTMLInputElement).value);
    const period = (elements.namedItem('period') as HTMLInputElement).value;
    const annualRate = parseFloat((elements.namedItem('annualRate') as HTMLInputElement).value) / 100;

    if (isNaN(initialAmount) || initialAmount < 0) {
      alert('請輸入有效的初始投入金額');
      return;
    }

    if (isNaN(periodicAmount) || periodicAmount < 0) {
      alert('請輸入有效的定期投入金額');
      return;
    }

    if (isNaN(annualRate) || annualRate < 0) {
      alert('請輸入有效的年利率');
      return;
    }

    const periodsPerYear = period === 'monthly' ? 12 : 1;
    const ratePerPeriod = annualRate / periodsPerYear;

    const calculationResults: CalculationResult[] = [];

    for (let year = 1; year <= 50; ++year) {
      const totalPeriods = year * periodsPerYear;

      const initialFutureValue = initialAmount * Math.pow(1 + ratePerPeriod, totalPeriods);

      const periodicFutureValue = periodicAmount *
        ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);

      const totalAmount = initialFutureValue + periodicFutureValue;
      const principal = initialAmount + (periodicAmount * totalPeriods);
      const interest = totalAmount - principal;

      calculationResults.push({
        year,
        totalAmount: Math.round(totalAmount),
        principal: Math.round(principal),
        interest: Math.round(interest)
      });
    }

    setResults(calculationResults);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-TW').format(num);
  };

  return (
    <main>
      <h1 className="m-3 text-3xl font-bold">定期定額計算機</h1>
      <form onSubmit={formSubmit} className="text-2xl [&>div]:m-3 [&>div>span]:mr-2 [&>div>input]:my-2 [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2">
        <div>
          <span>初始投入金額 (元)</span>
          <input
            type="number"
            name="initialAmount"
            defaultValue="0"
            min="0"
            step="1"
            required
          />
        </div>
        <div>
          <span>定期投入金額 (元)</span>
          <input
            type="number"
            name="periodicAmount"
            defaultValue="3000"
            min="0"
            step="1"
            required
          />
        </div>
        <div>
          <span>投入頻率</span>
          <div className="my-2">
            <label className="mr-4">
              <input
                type="radio"
                name="period"
                value="monthly"
                defaultChecked
                className="mr-1"
              />
              月定期投入
            </label>
            <label>
              <input
                type="radio"
                name="period"
                value="yearly"
                className="mr-1"
              />
              年定期投入
            </label>
          </div>
        </div>
        <div>
          <span>年利率 (%)</span>
          <input
            type="number"
            name="annualRate"
            defaultValue="5"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <button className="my-2 border border-black p-8">計算</button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="m-3">
          <h2 className="text-2xl font-bold mb-4">計算結果</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">年數</th>
                  <th className="border border-gray-300 p-2 text-left">總金額 (元)</th>
                  <th className="border border-gray-300 p-2 text-left">本金 (元)</th>
                  <th className="border border-gray-300 p-2 text-left">利息 (元)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.year} className={result.year % 5 === 0 ? 'bg-yellow-50' : ''}>
                    <td className="border border-gray-300 p-2">{result.year}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(result.totalAmount)}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(result.principal)}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(result.interest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Ad id={6861374436} />
    </main>
  );
}
