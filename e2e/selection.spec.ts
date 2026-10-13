import { expect, test } from '@playwright/test'

/** O que é controle não seleciona; o que é conteúdo seleciona (n27). */

test('controles sem seleção, conteúdo com seleção', async ({ page }) => {
  await page.goto('/projects/plante')
  await expect(page.locator('.loading-screen')).toHaveCount(0)

  const userSelect = (selector: string) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).userSelect)

  for (const control of ['header nav a', 'button', '.badge', '.project-pagination a']) {
    expect(await userSelect(control), control).toBe('none')
  }
  for (const content of ['h1', '.markdown-content p', 'footer .footer-email span']) {
    expect(await userSelect(content), content).not.toBe('none')
  }
})
