import { writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import areas from './areas.json' with { type: 'json' };

const data = [];

for (const [city, towns] of Object.entries(areas)) {
  for (const town of towns) {
    try {
      const xml = await fetch(
        'https://emap.pcsc.com.tw/EMapSDK.aspx',
        {
          method: 'POST',
          body: new URLSearchParams({
            commandid: 'SearchStore',
            city,
            town,
            leftMenuChecked: 'A1'
          })
        }
      ).then(res => res.text());

      const dom = new JSDOM(xml, { contentType: 'text/xml' });
      const nodes = dom.window.document.querySelectorAll('GeoPosition');

      for (const node of nodes) {
        data.push({
          name: node.querySelector('POIName').textContent,
          address: node.querySelector('Address').textContent,
          latitude: parseInt(node.querySelector('Y').textContent) / 1000000,
          longitude: parseInt(node.querySelector('X').textContent) / 1000000,
          time: node.querySelector('OP_TIME').textContent
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

writeFileSync('./data.json', JSON.stringify(data, null, '  '));
