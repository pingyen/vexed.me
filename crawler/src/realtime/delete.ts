import { createClient } from 'redis';

(async () => {
  const redis = await createClient({
    url: 'redis://redis'
  }).connect();

  const url = process.argv[2];

  await redis.ZREM('realtime:pages', url);
  await redis.DEL(`realtime:article:${url}`);
  redis.disconnect();
})();
