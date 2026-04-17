import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

let liked = false;
let count = 0;

export const resetLikeState = () => {
  liked = false;
  count = 0;
};

export const server = setupServer(
  http.post('/api/like', async () => {
    liked = true;
    count += 1;
    return HttpResponse.json({ isbn13: 'X', liked, liked_count: count });
  }),
  http.delete('/api/like', async () => {
    liked = false;
    count = Math.max(0, count - 1);
    return HttpResponse.json({ isbn13: 'X', liked, liked_count: count });
  }),
  http.get('/api/like/:isbn13', async () => {
    return HttpResponse.json({ isbn13: 'X', liked, liked_count: count });
  })
);
