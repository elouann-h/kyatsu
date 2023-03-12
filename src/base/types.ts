export type CreateAnonymArray<Length extends number, Acc extends unknown[] = []>
  = Acc['length'] extends Length ? Acc : CreateAnonymArray<Length, [...Acc, 1]>

export type NumRange<_Start extends number[], _End extends number, Acc extends number=never>
  = _Start['length'] extends _End ? Acc | _End : NumRange<[..._Start, 1], _End, Acc | _Start['length']>