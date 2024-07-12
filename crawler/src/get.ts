import { createClient } from 'redis';

(async () => {
  const redis = await createClient({
    url: 'redis://redis'
  }).connect();

  const url = process.argv[2];

  console.log(JSON.parse(await redis.GET(`realtime:article:${url}`) as string));

  redis.disconnect();
})();
