import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '民國、西元、日本年號對照表'
};

const getJapaneseEra = (year: number): string => {
  if (year >= 2019) return `令和 ${year - 2018}`;
  if (year >= 1989) return `平成 ${year - 1988}`;
  if (year >= 1926) return `昭和 ${year - 1925}`;
  if (year >= 1912) return `大正 ${year - 1911}`;
  if (year >= 1868) return `明治 ${year - 1867}`;
  return '';
};

export default function Page() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = currentYear; i >= 1912; --i) {
    years.push(i);
  }

  return (
    <div className="p-5 font-sans max-w-sm">
      <h1 className="text-2xl text-center mb-5">民國、西元、日本年號對照表</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300 text-left">民國</th>
            <th className="p-2 border border-gray-300 text-left">西元</th>
            <th className="p-2 border border-gray-300 text-left">日本年號</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year} className="border-b border-gray-200">
              <td className="p-2 border border-gray-300">民國 {year - 1911} 年</td>
              <td className="p-2 border border-gray-300 bg-gray-100">{year} 年</td>
              <td className="p-2 border border-gray-300">{getJapaneseEra(year)} 年</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
