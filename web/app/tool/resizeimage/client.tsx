'use client';

import Ad from '../../../component/ad';

export default function Client() {
  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const elements = target.elements;
    const files = (elements.namedItem('files') as HTMLInputElement)!.files as FileList;
    const width = parseInt((elements.namedItem('width') as HTMLInputElement).value);
    const height = parseInt((elements.namedItem('height') as HTMLInputElement).value);

    if (isNaN(width) === true &&
        isNaN(height) === true) {
      alert('請至少填寫寬或高');
      return;
    }

    const format = (elements.namedItem('format') as HTMLSelectElement).value;

    Array.from(files).forEach(file => {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', e => {
        const image = new Image();

        image.addEventListener('load', function() {
          let w = this.width;
          let h = this.height;

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (isNaN(width) === false &&
              isNaN(height) === false) {
              w = width;
              h = height;
          } else if (isNaN(width) === false) {
            h *= width / w;
            w = width;
          } else { // isNaN(height) === false
            w *= height / h;
            h = height;
          }

          canvas.width = w;
          canvas.height = h;
          context!.drawImage(this, 0, 0, w, h);

          const anchor = document.createElement('a');

          anchor.href = canvas.toDataURL('image/' + format, 1.0);

          anchor.download = (() => {
            const name = file.name;
            const prefix = name.substring(0, name.lastIndexOf('.'));
            return `${prefix}_resized.${format === 'jpeg' ? 'jpg' : format}`;
          })();

          anchor.click();
        });

        image.src = e.target!.result as string;
      });

      fileReader.readAsDataURL(file);
    });
  };

  return (
    <main>
      <h1 className="m-3 text-3xl font-bold">一次調整多張圖片寬高</h1>
      <form onSubmit={formSubmit} className="text-2xl [&>div]:m-3 [&>div>span]:mr-2 [&>div>input]:my-2 [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2">
        <div><input type="file" name="files" accept="image/*" multiple required className="max-w-full" /></div>
        <div>
          <span>寬 (可省略)</span>
          <input placeholder="" type="number" name="width" defaultValue="640" min="1" />
        </div>
        <div>
          <span>高 (可省略)</span>
          <input type="number" name="height" min="1" />
        </div>
        <div>
          <span>輸出格式</span>
          <select name="format" className="my-2 border border-black p-2">
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        <div><button className="my-2 border border-black p-8">調整</button></div>
      </form>
      <Ad id={2237259198} />
    </main>
  );
}
