import { assertEquals } from 'https://deno.land/std@0.132.0/testing/asserts.ts';
import { generateRandomPositiveInt } from './utils.ts';

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
