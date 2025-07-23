import { createClient, RedisClientType } from 'redis';
import realtime from './realtime';
import cron from 'node-cron';

(async () => {
  const redis: RedisClientType = createClient({
    url: 'redis://redis'
  });

  await redis.connect();

  realtime.init(redis);

  cron.schedule('9,19,29,39,49,59 * * * *', (() => {
    let crawling = false;

    return async () => {
      if (crawling === true) {
        return;
      }

      crawling = true;
      await realtime.gatherUrls();
      await realtime.crawlCandidates();
      crawling = false;
    };
  })());

  cron.schedule('30 5,13,21 * * *', realtime.expireArticles);
})();
