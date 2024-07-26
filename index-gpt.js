import http from 'http';
import { createPost, getPosts, getPostById, updatePostbyId, deletePostbyId } from './handlers.js';
import { processBodyFromRequest, returnErrorWithMessage } from './utils.js';

const port = process.env.PORT || 3000;

const headers = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',  // You can change this to your frontend's URL without / at the end
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': 2592000,  // 30 days
  'Content-Type': 'application/json',
};

const handleCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
  res.setHeader('Access-Control-Allow-Methods', headers['Access-Control-Allow-Methods']);
  res.setHeader('Access-Control-Allow-Headers', headers['Access-Control-Allow-Headers']);
  res.setHeader('Access-Control-Max-Age', headers['Access-Control-Max-Age']);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
};

const server = http.createServer(async (req, res) => {
  if (handleCors(req, res)) {
    return;
  }

  try {
    if (req.url.startsWith('/posts')) {
      if (req.url === '/posts' && req.method === 'GET') {
        await getPosts(req, res, headers);
      } else if (req.url === '/posts' && req.method === 'POST') {
        await createPost(req, res, headers);
      } else if (req.url.match(/\/posts\/\d+/) && req.method === 'GET') {
        await getPostById(req, res, headers);
      } else if (req.url.match(/\/posts\/\d+/) && req.method === 'PUT') {
        await updatePostbyId(req, res, headers);
      } else if (req.url.match(/\/posts\/\d+/) && req.method === 'DELETE') {
        await deletePostbyId(req, res, headers);
      } else {
        res.writeHead(404, headers);
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    } else {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } catch (error) {
    console.error('Error handling request:', error);
    returnErrorWithMessage(res);
  }
});

server.listen(port, () => {
  console.log(`Backend Server (powered by NodeJS, cors compatible with frontends running on localhost:5173) \nis running on http://localhost:${port}`);
});
