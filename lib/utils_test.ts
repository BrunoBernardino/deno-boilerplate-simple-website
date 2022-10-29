import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import { escapeHtml, generateRandomPositiveInt } from './utils.ts';

Deno.test('that generateRandomPositiveInt works', () => {
  const notVeryRandomPositiveInt = generateRandomPositiveInt(0);
  assertEquals(notVeryRandomPositiveInt, 0);

  const randomPositiveInt = generateRandomPositiveInt(10);
  assertEquals(randomPositiveInt > -1, true);
  assertEquals(randomPositiveInt < 11, true);

  const anotherRandomPositiveInt = generateRandomPositiveInt();
  assertEquals(anotherRandomPositiveInt > -1, true);
  assertEquals(anotherRandomPositiveInt < 10001, true);
});

Deno.test('that escapeHtml works', () => {
  const tests = [
    {
      input: '<a href="https://example.com">URL</a>',
      expected: '&lt;a href=&quot;https://example.com&quot;&gt;URL&lt;/a&gt;',
    },
    {
      input: '"><img onerror=\'alert(1)\' />',
      expected: '&quot;&gt;&lt;img onerror=&#039;alert(1)&#039; /&gt;',
    },
  ];

  for (const test of tests) {
    const output = escapeHtml(test.input);
    assertEquals(output, test.expected);
  }
});
