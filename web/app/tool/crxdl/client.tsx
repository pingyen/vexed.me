'use client';

export default function Client() {
  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = ((e.target as HTMLFormElement).elements.namedItem('id') as HTMLInputElement).value.trim();

    if (id === '') {
      alert('請輸入 Extension ID');
      return;
    }

    location.href = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=9999.0.9999.0&acceptformat=crx2,crx3&x=id%3D${id}%26uc`;
  };

  return (
    <main>
      <h1 className="m-3 text-3xl font-bold">下載 Chrome Extension</h1>
      <form onSubmit={formSubmit} className="[&>div]:text-3xl [&>div]:m-3 [&>div>span]:mr-3 [&>div>input]:my-2 [&>div>input]:w-full [&>div>input]:max-w-xl [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2">
        <div>
          <span>Extension ID</span>
          <input name="id" defaultValue="dhdgffkkebhmkfjojejmpbldmpobfkfo" />
        </div>
        <div><button className="my-2 border border-black p-8">下載</button></div>
      </form>
    </main>
  );
}
