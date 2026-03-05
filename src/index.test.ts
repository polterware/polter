import { describe, it, expect } from 'vitest';
import { hello, version } from './index';

describe('polterbase', () => {
  it('should return a greeting', () => {
    expect(hello()).toBe('Hello, world! Welcome to Polterbase.');
    expect(hello('Erick')).toBe('Hello, Erick! Welcome to Polterbase.');
  });

  it('should have a version', () => {
    expect(version).toBe('0.1.0');
  });
});
