import { Town } from '../town/_common'
import { NPC } from './_common'
import { weightRandom } from '../src/weightRandom'
import { socialClass } from './socialClass'
import { articles } from '../src/articles'
import { findProfession } from '../src/findProfession'
import { random } from '../src/random'
import { wageVariation } from './npcFinances'

export function createClass (town: Town, npc: NPC) {
  console.log(`Assigning class traits to "${npc.name}".`)

  /** @type {string} */
  let background
  /** @type {string} */
  let classWeapon
  const profession = findProfession(town, npc)
  if (profession.background) {
    background = weightRandom(profession.background)
  } else {
    background = weightRandom(socialClass[npc.socialClass].defaultBackground)
  }

  npc.professionOrigin = npc.professionOrigin || getProfessionOrigin(npc, town)
  npc.background = npc.background || background
  npc.weapon = npc.weapon || classWeapon
}

/**
 * @param {NPC} npc
 * @param {Town} town
 * @returns {string}
 */
function getProfessionOrigin (npc: NPC, town: Town): string {
  /** @type {import("../../lib/index").Profession} */
  const profession = findProfession(town, npc)

  if (profession.professionOrigin) {
    return random(profession.professionOrigin)
  }

  const professionWithArticle = articles.output(npc.profession)

  /** @type {[number, string][]} */
  const originWage = [
    [-25, `I've tried to do a good job as ${professionWithArticle} but am just rubbish at it. I don't think I'm good at anything, really.`],
    [-20, `I've been trying to make it as ${professionWithArticle} but suck at it. I'm beginning to think I was never meant to be ${professionWithArticle}.`],
    [-15, `I've been trying to make it as ${professionWithArticle} but just can't seem to hack it. I think I'll quit.`],
    [-10, `I've had trouble as ${professionWithArticle}. I guess some people are born with it- I'm sure as hell not.`],
    [-5, `I've had a bit of a downturn as ${professionWithArticle}. If it keeps up for much longer, I'm going to begin losing hope.`],
    [0, `I'm working as ${professionWithArticle}. The work is alright, ${['and I enjoy it', 'though it can be a bit tedious', 'I\'ve certainly had worse jobs', 'if a little dull', 'if a little dull at times'].random()}`],
    [5, `I'm on the upswing as ${professionWithArticle}. Things are looking better.`],
    [10, `I'm doing really well as ${professionWithArticle}! Maybe it's luck, maybe a natural talent, I don't know.`],
    [15, `It turns out that I'm pretty good at being ${professionWithArticle}! I enjoy the work.`],
    [20, `It turns out that I'm really good at being ${professionWithArticle}. It's actually kinda easy.`],
    [25, `Not to brag, but I'm a born natural at being ${professionWithArticle}. It's fun, very rewarding work.`]
  ]

  for (const [amount, origin] of originWage) {
    if (amount >= wageVariation(town, npc)) return origin
  }

  throw new Error('Could not get profession origin.')
}
