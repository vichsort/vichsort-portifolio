/**
 * Comando 'matrix'
 * Chuva de caracteres ocupando a janela inteira, até um Ctrl+C (ou toque).
 * É um processo em primeiro plano: o prompt espera ele acabar.
 * Com movimento reduzido, não anima: só avisa.
 */
export const matrixCommand = {
  name: 'matrix',
  aliases: ['cmatrix'],
  async execute(args, flags, { spawn, t, globalState }) {
    if (!globalState.motionAllowed?.value) return { type: 'text', payload: t('terminal.output.matrix.reduced') }

    const { interrupted } = await spawn('matrix')
    return interrupted ? { type: 'text', payload: '^C' } : null
  }
}
