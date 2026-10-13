import { expect, test, type Page } from '@playwright/test'

/**
 * Animações (n28): o sistema decide só na primeira visita; depois vale o interruptor
 * do site, nos dois sentidos. O CSS inteiro consulta html.motion-off.
 */

const KEY = 'user-animations-enabled'

async function open(page: Page, { system, saved }: { system: 'reduce' | 'no-preference'; saved?: 'true' | 'false' }) {
  await page.emulateMedia({ reducedMotion: system })
  if (saved) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [KEY, saved])
  await page.goto('/contact')
  await expect(page.locator('.loading-screen')).toHaveCount(0)
}

// Duração da transição de um card: 0.01ms (1e-05s) quando o movimento está desligado
const cardTransition = (page: Page) => page.locator('.email-card').evaluate((el) => getComputedStyle(el).transitionDuration)

const motionOff = (page: Page) => page.evaluate(() => document.documentElement.classList.contains('motion-off'))

test('primeira visita com movimento reduzido no sistema: sem animação, e a escolha fica salva', async ({ page }) => {
  await open(page, { system: 'reduce' })
  expect(await motionOff(page)).toBe(true)
  expect(await cardTransition(page)).toBe('1e-05s')
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('false')
})

test('o interruptor ligado vence o movimento reduzido do sistema', async ({ page }) => {
  await open(page, { system: 'reduce', saved: 'true' })
  expect(await motionOff(page)).toBe(false)
  expect(await cardTransition(page)).not.toBe('1e-05s')
})

test('o interruptor desligado vale mesmo sem preferência no sistema', async ({ page }) => {
  await open(page, { system: 'no-preference', saved: 'false' })
  expect(await motionOff(page)).toBe(true)
})

test('o interruptor muda na hora, sem recarregar', async ({ page }) => {
  await open(page, { system: 'reduce' })
  await page.getByRole('button', { name: /configura|settings/i }).first().click()
  const toggle = page.locator('.toggle-btn[aria-pressed]')
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  expect(await motionOff(page)).toBe(false)
  await toggle.click()
  expect(await motionOff(page)).toBe(true)
})
