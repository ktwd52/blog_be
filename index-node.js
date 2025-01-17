//Tibor 
//Bring in the http module
import http from 'http';
// Import CRUD operations
import { createPost, deletePostbyId, getPosts, getPostById, updatePostbyId } from './crudOperations.js';
// Import utility functions
import { regex, returnErrorWithMessage } from './utils.js';

// Base resource
const resource = '/posts';

// Request handler to handle all requests
const requestHandler = async (req, res) => {

  const { method, url } = req;
  if (url === resource) {
    if (method === 'GET') return await getPosts(req, res);
    if (method === 'POST') return await createPost(req, res);
    else return returnErrorWithMessage(res, 405, 'Method Not Allowed');
  } 
  else if (regex(resource).test(url)) {
    if (method === 'GET') return await getPostById(req, res);
    if (method === 'GET') return await getPostById(req, res);
    if (method === 'PUT') return await updatePostbyId(req, res);
    if (method === 'DELETE') return await deletePostbyId(req, res);
    else return returnErrorWithMessage(res, 405, 'Method Not Allowed');
  } else {
    return returnErrorWithMessage(res, 404, 'Resource Not Found');
  }
};
// Create a server
const server = http.createServer(requestHandler);
// Set the port
const port = 3000;
// Start the server
server.listen(port, () => console.log(`Backend Server (powered by NodeJS not cors compatible, but works with Postman) \nis running on http://localhost:${port}`));
