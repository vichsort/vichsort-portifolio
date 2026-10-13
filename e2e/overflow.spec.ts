import { expect, test } from '@playwright/test'
import { PAGES } from '../src/core/router/pages.js'
import { LANGS } from '../src/core/i18n/languages.js'

/**
 * Nenhuma rota rola para o lado no celular (n19). O overflow-x: hidden do body
 * esconde o estouro na tela, mas o iOS ainda deixa arrastar: o teste o desliga
 * para medir a largura de verdade. Nos quatro idiomas: os títulos mudam de tamanho.
 */

const ROUTES = [
  ...PAGES.filter((page) => !page.path.includes(':')).map((page) => page.path),
  '/projects/plante',
  '/gallery/hackathon-agro-equipe'
]

for (const lang of LANGS) {
for (const route of ROUTES) {
  test(`sem rolagem lateral em ${route} (${lang})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('user-lang', value), lang)
    await page.goto(route)
    await expect(page.locator('#app .boot')).toHaveCount(0)
    await expect(page.locator('.loading-screen')).toHaveCount(0)
    await page.waitForLoadState('networkidle')
    await page.addStyleTag({ content: 'html, body { overflow-x: visible !important; }' })

    const overflow = await page.evaluate(() => {
      const width = document.documentElement.clientWidth
      // Quem passa da borda e aumenta a página: fora de um contêiner que rola ou corta na
      // horizontal, e sem ser fixo (navbar) nem invisível (a navegação desktop no celular)
      const harmless = (el: Element) => {
        if (getComputedStyle(el).visibility === 'hidden') return true
        for (let p: Element | null = el; p && p !== document.body; p = p.parentElement) {
          const style = getComputedStyle(p)
          if (style.position === 'fixed') return true
          if (p !== el && style.overflowX !== 'visible') return true
        }
        return false
      }
      const offenders = [...document.body.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > width + 1 && !harmless(el))
        .map((el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''} → ${Math.round(el.getBoundingClientRect().right)}px`)
      return { scrollWidth: document.documentElement.scrollWidth, width, offenders: offenders.slice(0, 8) }
    })

    expect(overflow.offenders, `largura ${overflow.scrollWidth}px em ${overflow.width}px`).toEqual([])
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width)
  })
}
}
