import structure, { assets } from 'virtual:content/structure'
import * as loaders from 'virtual:content/loaders'
import { hydrateGraph, resolveAssets } from './structure.ts'
import { createQueries, type TextSource } from './queries.ts'
import type { NodeText } from './types.ts'

/**
 * O grafo de conteúdo no site (a13). O vault é lido no build (scripts/contentPlugin.mjs):
 * aqui chegam a estrutura, no arquivo principal, e os textos de cada idioma, baixados
 * só quando usados.
 *
 * - textos (títulos, resumos, legendas): loadLanguage, antes da primeira tela e de cada
 *   troca de idioma (core/i18n);
 * - corpos, com requireBodies: 'html' para as páginas de detalhe (projeto, foto) e
 *   'plain' para o terminal. Depois do primeiro pedido, a troca de idioma também baixa
 *   os corpos daquele tipo no novo idioma.
 *
 * As consultas são síncronas: quem pede um texto antes de ele chegar recebe vazio.
 */

export type BodyKind = 'html' | 'plain'

interface LangTexts {
  text: Record<string, Partial<NodeText>>
  /** Idioma do texto de cada nó (o pedido ou o da cadeia de fallback). */
  used: Record<string, string>
}

export const graph = hydrateGraph(structure, assets)

const texts: Record<string, LangTexts> = {}
const bodies: Record<BodyKind, Record<string, Record<string, string>>> = { html: {}, plain: {} }
const wanted = new Set<BodyKind>()
const pending = new Map<string, Promise<void>>()

// Uma busca por módulo, mesmo com pedidos simultâneos
function once(key: string, fetch: () => Promise<void>): Promise<void> {
  let promise = pending.get(key)
  if (!promise) {
    promise = fetch().catch((err) => {
      pending.delete(key)
      throw err
    })
    pending.set(key, promise)
  }
  return promise
}

const loadTexts = (lang: string) =>
  once(`texts/${lang}`, async () => {
    texts[lang] = (await loaders.texts[lang]()).default
  })

const loadBodies = (kind: BodyKind, lang: string) =>
  once(`${kind}/${lang}`, async () => {
    const loaded = (await loaders[kind][lang]()).default
    // O HTML aponta para as imagens da pasta do nó pela marca do build
    bodies[kind][lang] = Object.fromEntries(Object.entries(loaded).map(([id, body]) => [id, resolveAssets(body, assets)]))
  })

/** Textos do idioma, e os corpos que alguma página já pediu. */
export async function loadLanguage(lang: string): Promise<void> {
  await Promise.all([loadTexts(lang), ...[...wanted].map((kind) => loadBodies(kind, lang))])
}

/** Corpos do idioma, para as páginas que mostram o texto completo. */
export function requireBodies(kind: BodyKind, lang: string): Promise<void> {
  wanted.add(kind)
  return loadBodies(kind, lang)
}

const source: TextSource = {
  textLang: (id, lang) => texts[lang]?.used[id] ?? null,
  text: (id, lang) => texts[lang]?.text[id] ?? {},
  html: (id, lang) => bodies.html[lang]?.[id] ?? '',
  plain: (id, lang) => bodies.plain[lang]?.[id] ?? ''
}

export const content = createQueries(graph, source)
