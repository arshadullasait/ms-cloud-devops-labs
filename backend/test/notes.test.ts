import { describe, expect, it } from 'vitest';
import { buildNote, sortNotes, ValidationError } from '../src/notes.js';

describe('buildNote', () => {
  it('keeps the title and body it is given', () => {
    const note = buildNote({ title: 'Docker', body: 'layers are cached' });
    expect(note.title).toBe('Docker');
    expect(note.body).toBe('layers are cached');
    expect(note.id).toHaveLength(36);
  });

  it('trims surrounding whitespace from the title', () => {
    expect(buildNote({ title: '  spaced out  ', body: '' }).title).toBe('spaced out');
  });

  it('rejects an empty title', () => {
    expect(() => buildNote({ title: '   ', body: 'x' })).toThrow(ValidationError);
  });

  it('rejects a title longer than 80 characters', () => {
    expect(() => buildNote({ title: 'a'.repeat(81), body: '' })).toThrow(ValidationError);
  });

  it('defaults a missing body to an empty string', () => {
    expect(buildNote({ title: 'no body' }).body).toBe('');
  });
});

describe('sortNotes', () => {
  it('returns the newest note first', () => {
    const older = { id: '1', title: 'older', body: '', createdAt: '2026-01-01T00:00:00.000Z' };
    const newer = { id: '2', title: 'newer', body: '', createdAt: '2026-06-01T00:00:00.000Z' };
    expect(sortNotes([older, newer]).map((n) => n.id)).toEqual(['2', '1']);
  });
});

describe('buildNote extras', () => {
  it('stamps createdAt from the time it is given', () => {
    const when = new Date('2026-10-16T10:00:00.000Z');
    expect(buildNote({ title: 'timed' }, when).createdAt).toBe('2026-10-16T10:00:00.000Z');
  });

  it('rejects a title that is not a string', () => {
    expect(() => buildNote({ title: 42 })).toThrow(ValidationError);
  });
});
