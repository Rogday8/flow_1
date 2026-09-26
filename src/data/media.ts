// Все картинки подтягиваются через glob — Vite сам захеширует их при сборке.
const photoFiles = import.meta.glob<string>('../assets/photos/*.webp', { eager: true, import: 'default' })
const cutFiles = import.meta.glob<string>('../assets/cut/*.webp', { eager: true, import: 'default' })
const headFiles = import.meta.glob<string>('../assets/heads/*.webp', { eager: true, import: 'default' })

const byName = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace('.webp', ''), url]))

const photos = byName(photoFiles)
const cuts = byName(cutFiles)
const heads = byName(headFiles)

export type PhotoName =
  | 'rose-box' | 'cream-roses' | 'pink-tulips' | 'box-duo' | 'tulip-mix' | 'peony-garden'
  | 'peony-bouquet' | 'roses-dark' | 'peony-dark' | 'bride-bouquet' | 'tulips-love' | 'carnations'
  | 'ranunculus-stems' | 'purple-tulips' | 'hands-bouquet' | 'wild-bouquet' | 'noir-bouquet'
  | 'blush-roses' | 'red-roses' | 'coral-peonies' | 'shop-buckets' | 'shop-street' | 'shop-facade'
  | 'florist-desk' | 'ranunculus-vase' | 'tulip-top' | 'tulips-coffee' | 'rose-basket' | 'roses-vase'
  | 'moody-roses' | 'peony-noir' | 'peony-window' | 'rose-drops' | 'ranunculus-peach' | 'daisies'
  | 'tulip-market' | 'carnation-vase' | 'peony-bush' | 'window-roses' | 'lilac-vase'

export type CutName =
  | 'orange-rose' | 'yellow-peony' | 'noir-ranunculus' | 'amber-ranunculus' | 'anemone' | 'poppy'
  | 'pink-rose' | 'white-orchid' | 'protea' | 'coral-rose' | 'blush-ranunculus' | 'iris' | 'lotus'
  | 'lily' | 'pink-ranunculus' | 'white-blossom' | 'gold-ranunculus'

export const photo = (name: PhotoName) => photos[name]
export const cut = (name: CutName) => cuts[name]

/** Головки цветов без длинных стеблей — для конструктора букета */
export type HeadName =
  | 'pink-rose' | 'coral-rose' | 'orange-rose' | 'yellow-peony' | 'blush-ranunculus' | 'amber-ranunculus'
  | 'pink-ranunculus' | 'anemone' | 'iris' | 'lily' | 'protea' | 'poppy' | 'white-blossom'

export const head = (name: HeadName) => heads[name]
