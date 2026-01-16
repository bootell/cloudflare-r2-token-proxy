export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Path prefix (read from environment variable, defaults to empty)
      const pathPrefix = env.PATH_PREFIX || '';
      
      // Check if path prefix matches
      if (pathPrefix && !pathname.startsWith(pathPrefix)) {
        return new Response('Not Found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // Token authentication
      if (!env.AUTH_TOKEN) {
        return new Response('Server configuration error', { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      const token = url.searchParams.get('token');
      
      if (token !== env.AUTH_TOKEN) {
        return new Response('Unauthorized', { 
          status: 401,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // Remove prefix, then remove leading slash to get file name
      const pathWithoutPrefix = pathPrefix ? pathname.substring(pathPrefix.length) : pathname;
      const fileName = pathWithoutPrefix.startsWith('/') ? pathWithoutPrefix.substring(1) : pathWithoutPrefix;
      
      // Empty path or path traversal attack
      if (!fileName || fileName.includes('..')) {
        return new Response('Not Found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      try {
        const object = await env.PROXY_CONFIG.get(fileName);
        
        if (!object) {
          return new Response('Not Found', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
        
        return new Response(object.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/yaml; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        });
        
      } catch (error) {
        return new Response('Not Found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
  };