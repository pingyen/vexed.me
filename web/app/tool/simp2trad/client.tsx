'use client';

import Ad from '../../../component/ad';
import s2tChar from 'tongwen-dict/dist/s2t-char.json';

const s2tEntries = Object.entries(s2tChar);

export default function Client() {
  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const elements = target.elements;
    const files = (elements.namedItem('files') as HTMLInputElement)!.files as FileList;
    const charset = (elements.namedItem('charset') as HTMLSelectElement).value;

    Array.from(files).forEach(file => {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', e => {
        let text = e.target!.result as string;

        for (const [search, replace] of s2tEntries) {
          text = text.replaceAll(search, replace);
        }

        const anchor = document.createElement('a');

        anchor.href = 'data:text/plain;charset=utf-8,' + encodeURI(text);

        anchor.download = (() => {
          const name = file.name;
          const index = name.lastIndexOf('.');
          const prefix = name.substring(0, index);
          const extn = name.substring(index + 1);
          return `${prefix}_zh-hant.${extn}`;
        })();

        anchor.click();
      });

      fileReader.readAsText(file, charset);
    });
  };

  return (
    <main>
      <h1 className="m-3 text-3xl font-bold">一次轉換多個簡體中文純文字檔至繁體中文</h1>
      <form onSubmit={formSubmit} className="text-2xl [&>div]:m-3">
        <div><input type="file" name="files" accept="text/*" multiple required className="max-w-full my-2 border border-black p-2" /></div>
        <div>
          <span className="mr-2">文字編碼</span>
          <select name="charset" className="my-2 border border-black p-2">
            <option value="UTF-8">UTF-8</option>
            <option value="GBK">GB</option>
          </select>
        </div>
        <div><button className="my-2 border border-black p-8">轉換</button></div>
      </form>
      <p className="m-3 text-lg">Powered by <a href="https://github.com/tongwentang" target="_blank">新同文堂</a></p>
      <Ad id={2613742201} />
    </main>
  );
}
