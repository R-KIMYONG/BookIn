import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

let liked = false;
let count = 0;

export const resetLikeState = () => {
  liked = false;
  count = 0;
};

export const server = setupServer(
  http.post('/api/like/user', async () => {
    liked = true;
    count += 1;
    return HttpResponse.json({ isbn13: 'X', liked, liked_count: count });
  }),
);
