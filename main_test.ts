import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import { abortController } from './main.ts';

const baseUrl = 'http://localhost:8000';

Deno.test({
  name: 'HTTP Server',
  fn: async () => {
    let response = await fetch(`${baseUrl}/`);
    assertEquals(response.status, 200);

    let responseText = await response.text();
    assertEquals(responseText.includes('Welcome to a Simple Deno Website Boilerplate!'), true);

    response = await fetch(`${baseUrl}/dynamic`);
    assertEquals(response.status, 200);

    responseText = await response.text();
    assertEquals(responseText.includes('This page is dynamic (wooooo)!'), true);

    response = await fetch(`${baseUrl}/blah`);
    assertEquals(response.status, 404);

    responseText = await response.text();
    assertEquals(responseText, 'Not Found');

    abortController.abort('Test finished');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
