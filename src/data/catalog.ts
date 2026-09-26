import type { HeadName, PhotoName } from './media'

export type Category = 'all' | 'roses' | 'peonies' | 'tulips' | 'signature' | 'boxes'

export const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'signature', label: 'Авторские' },
  { id: 'roses', label: 'Розы' },
  { id: 'peonies', label: 'Пионы' },
  { id: 'tulips', label: 'Тюльпаны' },
  { id: 'boxes', label: 'Коробки' },
]

export type Product = {
  id: string
  name: string
  note: string
  price: number
  category: Exclude<Category, 'all'>
  image: PhotoName
  hover: PhotoName
  tag?: string
}

export const products: Product[] = [
  { id: 'aurora', name: 'Аврора', note: 'кремовые розы, эвкалипт, гипсофила', price: 7900, category: 'signature', image: 'cream-roses', hover: 'blush-roses', tag: 'Хит' },
  { id: 'velvet', name: 'Бархат', note: '25 розовых роз в шляпной коробке', price: 9400, category: 'boxes', image: 'rose-box', hover: 'box-duo', tag: 'Новинка' },
  { id: 'coral-dream', name: 'Коралловый сон', note: 'пионы Coral Charm, 9 стеблей', price: 8600, category: 'peonies', image: 'coral-peonies', hover: 'peony-bush' },
  { id: 'first-kiss', name: 'Первый поцелуй', note: 'розовые тюльпаны, 35 стеблей', price: 5200, category: 'tulips', image: 'pink-tulips', hover: 'tulips-love' },
  { id: 'noir', name: 'Нуар', note: 'тёмные розы, ранункулюсы, ягоды', price: 11200, category: 'signature', image: 'noir-bouquet', hover: 'moody-roses', tag: 'Лимитед' },
  { id: 'garden', name: 'Сад Моне', note: 'пионы, садовые розы, маттиола', price: 9900, category: 'peonies', image: 'peony-bouquet', hover: 'peony-garden' },
  { id: 'scarlet', name: 'Алая', note: '51 красная роза Эквадор', price: 14500, category: 'roses', image: 'red-roses', hover: 'roses-dark' },
  { id: 'meadow', name: 'Луговая', note: 'полевые цветы, ромашки, злаки', price: 4600, category: 'signature', image: 'wild-bouquet', hover: 'daisies' },
  { id: 'palette', name: 'Палитра', note: 'микс тюльпанов, 51 стебель', price: 7400, category: 'tulips', image: 'tulip-mix', hover: 'tulip-top' },
  { id: 'blush', name: 'Румянец', note: 'пудровые кустовые розы', price: 6300, category: 'roses', image: 'blush-roses', hover: 'rose-basket' },
  { id: 'peach', name: 'Персик', note: 'ранункулюсы, 15 стеблей', price: 6900, category: 'signature', image: 'ranunculus-peach', hover: 'ranunculus-vase' },
  { id: 'duo', name: 'Дуэт', note: 'розы и эустома в коробке', price: 8200, category: 'boxes', image: 'box-duo', hover: 'rose-box' },
]

export const formatPrice = (n: number) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽'

/** Цветы для конструктора букета: scale — размер головки относительно остальных */
export type Stem = { id: string; name: string; price: number; head: HeadName; tint: string; scale: number }

export const stems: Stem[] = [
  { id: 'pink-rose', name: 'Роза пудровая', price: 290, head: 'pink-rose', tint: '#f3a9bd', scale: 1 },
  { id: 'coral-rose', name: 'Роза коралл', price: 320, head: 'coral-rose', tint: '#f0765f', scale: 1.02 },
  { id: 'orange-rose', name: 'Роза Кахала', price: 350, head: 'orange-rose', tint: '#e98a52', scale: 1.05 },
  { id: 'peony', name: 'Пион Лимонный', price: 590, head: 'yellow-peony', tint: '#f1e37a', scale: 1.18 },
  { id: 'blush-ranunculus', name: 'Ранункулюс пудра', price: 260, head: 'blush-ranunculus', tint: '#f5c7b8', scale: 0.92 },
  { id: 'amber-ranunculus', name: 'Ранункулюс янтарь', price: 260, head: 'amber-ranunculus', tint: '#eda54a', scale: 0.9 },
  { id: 'pink-ranunculus', name: 'Ранункулюс роза', price: 260, head: 'pink-ranunculus', tint: '#f4c2c6', scale: 0.9 },
  { id: 'anemone', name: 'Анемон', price: 240, head: 'anemone', tint: '#e8e4f4', scale: 0.95 },
  { id: 'iris', name: 'Ирис', price: 210, head: 'iris', tint: '#8d8ae8', scale: 0.95 },
  { id: 'lily', name: 'Лилейник', price: 380, head: 'lily', tint: '#f27a2c', scale: 1.05 },
  { id: 'protea', name: 'Протея', price: 890, head: 'protea', tint: '#c9557c', scale: 1.2 },
  { id: 'blossom', name: 'Флокс белый', price: 190, head: 'white-blossom', tint: '#f4f1ea', scale: 0.85 },
]

export const wraps = [
  { id: 'kraft', name: 'Крафт', color: '#b98f64', edge: '#8a6440' },
  { id: 'blush', name: 'Пудра', color: '#f2c6c8', edge: '#d99aa1' },
  { id: 'noir', name: 'Нуар', color: '#2a1a20', edge: '#4c2e38' },
  { id: 'sage', name: 'Шалфей', color: '#a9b79c', edge: '#7f9173' },
  { id: 'cream', name: 'Молоко', color: '#f4ece0', edge: '#d8c9b2' },
]
