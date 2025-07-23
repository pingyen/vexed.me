import { writeFileSync } from 'fs';

const data = [];

const cities = [
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '基隆市',
  '台北市',
  '新北市',
  '桃園市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
  '雲林縣',
  '嘉義市',
  '嘉義縣',
  '台南市',
  '高雄市',
  '屏東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
  '台中市',
  '彰化縣',
  '南投縣'
];

for (const city of cities) {
  try {
    const stores = await fetch(
      `https://api.map.com.tw/net/familyShop.aspx?searchType=ShopList&type=ice&city=${city}&area=&road=&fun=&key=6F30E8BF706D653965BDE302661D1241F8BE9EBC`,
      {
        headers: {
          'Referer': 'https://www.family.com.tw/'
        }
      }
    ).then(res => res.text())
     .then(text => text.substring(1, text.length - 1))
     .then(text => JSON.parse(text));

    for (const store of stores) {
      const features = store.all.split(',');

      data.push({
        name: store.NAME,
        address: store.addr,
        zipCode: parseInt(store.post),
        latitude: store.py,
        longitude: store.px,
        twoFlavors: features.includes('twoice'),
        specialShape: features.includes('Famiice')
      });
    }
  } catch (e) {
    console.error(e);
  }
}

data.sort((a, b) => {
  return a.zipCode - b.zipCode;
});

writeFileSync('./data.json', JSON.stringify(data, null, '  '));
