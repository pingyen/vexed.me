import { curly } from 'node-libcurl';
import { spawn } from 'child_process';

const puppeteerCmd = process.argv[0];
const puppeteerPath = `${__dirname}/puppeteer`;

const fetchContent = async (url: string, method: string | undefined) => {
  console.log('fetchContent', url, method !== undefined ? method : '');

  if (method === 'curl') {
    const data = (await curly.get(url, { timeout: 10 })).data;
    return typeof data === 'string' ? data : data.toString();
  }

  if (method === 'browser') {
    return await new Promise((resolve, reject) => {
      const outs: string[] = [];
      const errs: string[] = [];
      const proc = spawn(puppeteerCmd, [puppeteerPath, url]);

      proc.stdout.on('data', data => { outs.push(data); });
      proc.stderr.on('data', data => { errs.push(data); });

      proc.on('error', e => {
        reject(e.message);
      });

      proc.on('exit', () => {
        errs.length > 0 ?
          reject(errs.join('\n')) :
          resolve(outs.join(''));
      });
    });
  }

  return await fetch(url, { signal: AbortSignal.timeout(10000) })
    .then(response => {
      const url = response.url;

      if ((new URL(url)).pathname === '/') {
        throw new Error(`pathname === '/' ${url}`);
      }

      return response.text();
    });
};

export default fetchContent;
