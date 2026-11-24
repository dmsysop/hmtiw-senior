import { parseWatchmanDate } from '../../services/watchman'
import {
  onCallWorkedMinutes,
  summarizeDay,
  summarizeOnCallDay
} from './summarize'

// 2022-05: dia 2 = segunda, dia 7 = sábado
const workDay = (hours: string, minutes: string, open = false) =>
  summarizeDay(2022, 4, 2, { hours, minutes, open })

describe('summarizeDay', () => {
  it('marca dia aberto sem diferença', () => {
    expect(workDay('05', '00', true)).toEqual({
      differenceLabel: '',
      differenceMinutes: 0,
      color: 'red.400'
    })
  })

  it('marca folga quando não há registros', () => {
    expect(workDay('00', '00').differenceLabel).toBe('Folga')
  })

  it('zera a diferença dentro da tolerância de 10 minutos', () => {
    expect(workDay('08', '10').differenceMinutes).toBe(0)
    expect(workDay('07', '50').differenceMinutes).toBe(0)
  })

  it('calcula débito e crédito fora da tolerância', () => {
    expect(workDay('07', '15')).toMatchObject({
      differenceLabel: '-0:45',
      differenceMinutes: -45,
      color: 'red.400'
    })
    expect(workDay('09', '30')).toMatchObject({
      differenceLabel: '+1:30',
      differenceMinutes: 90,
      color: 'green.400'
    })
  })

  it('conta fim de semana inteiro como extra', () => {
    expect(
      summarizeDay(2022, 4, 7, { hours: '03', minutes: '20', open: false })
    ).toMatchObject({
      differenceLabel: '03:20 (Extra)',
      differenceMinutes: 200
    })
  })
})

describe('sobreaviso', () => {
  it('lê as datas do Watchman', () => {
    expect(parseWatchmanDate('De 03/11/2026, 18:00:00h')).toEqual(
      new Date(2026, 10, 3, 18, 0)
    )
  })

  // terça 03/11/2026, turno das 18h às 08h do dia seguinte
  const shifts = [
    {
      start: parseWatchmanDate('De 03/11/2026, 18:00:00h'),
      end: parseWatchmanDate('Até 04/11/2026, 08:00:00h')
    }
  ]
  const at = (day: number, hours: number, minutes = 0) =>
    new Date(2026, 10, day, hours, minutes)

  it('conta só o que foi batido dentro do turno', () => {
    // 08-12 e 13-19:30: 1h30 depois das 18h
    expect(
      onCallWorkedMinutes(
        [at(3, 8), at(3, 12), at(3, 13), at(3, 19, 30)],
        shifts
      )
    ).toBe(90)
    // manhã seguinte: 07-12 tem 1h antes das 08h; depois das 18h já não é turno
    expect(
      onCallWorkedMinutes([at(4, 7), at(4, 12), at(4, 13), at(4, 19)], shifts)
    ).toBe(60)
  })

  it('tira a hora recebida do dia e aplica a regra normal no restante', () => {
    const summarize = (hours: string, minutes: string, received: number) =>
      summarizeOnCallDay(2026, 10, 3, { hours, minutes, open: false }, received)

    // 9h30 com 1h30 em sobreaviso: 8h normais, nada no saldo
    expect(summarize('09', '30', 90)).toEqual({
      differenceLabel: '1:30 (Recebida)',
      differenceMinutes: 0,
      receivedMinutes: 90,
      color: 'purple.400'
    })
    // 10h com 1h em sobreaviso: sobra 1h de extra normal
    expect(summarize('10', '00', 60)).toMatchObject({
      differenceLabel: '+1:00 · 1:00 (Recebida)',
      differenceMinutes: 60,
      receivedMinutes: 60
    })
    // sem sobreaviso continua igual
    expect(summarize('09', '30', 0)).toMatchObject({
      differenceMinutes: 90,
      receivedMinutes: 0
    })
  })

  it('fim de semana: sobreaviso é recebida, o resto é extra', () => {
    // sábado 07/11/2026
    expect(
      summarizeOnCallDay(
        2026,
        10,
        7,
        { hours: '03', minutes: '00', open: false },
        120
      )
    ).toMatchObject({
      differenceLabel: '01:00 (Extra) · 2:00 (Recebida)',
      differenceMinutes: 60,
      receivedMinutes: 120
    })
  })
})
