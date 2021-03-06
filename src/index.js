import parse from './parse'
import translate from './translate'
import { ID, NAME, KEYWORD, SOURCE, TARGET, getLang, getLangs } from './constants'
import icon from './icon.png'

const langs = getLangs().map(({ code, name }) => ({
  icon,
  title: name,
  subtitle: code,
}))

const fn = async ({ term, display, actions }) => {
  const { copyToClipboard } = actions
  const { match, query, source, target } = parse(term)

  if (!match) {
    return
  }

  if (match && !query) {
    display({ icon, title: NAME })
    return
  }

  if (match && (query === 'l' || query === 'languages')) {
    display(langs)
    return
  }

  display({
    icon,
    id: ID,
    title: 'Loading...',
  })

  const { code: sourceCode } = source || getLang(SOURCE)
  const { code: targetCode, name: targetName } = target || getLang(TARGET)

  const title = await translate({
    query,
    source: sourceCode,
    target: targetCode,
  })

  display({
    icon,
    id: ID,
    title,
    subtitle: targetName,
    onSelect: () => copyToClipboard(title),
  })
}

export default {
  icon,
  name: NAME,
  keyword: KEYWORD,
  fn,
}
