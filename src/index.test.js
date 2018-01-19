jest.mock('./translate')

import plugin from './'
import translate from './translate'
import { ID, NAME } from './constants'
import icon from './icon.png'

let display
let translated

describe('plugin', () => {
  beforeEach(() => {
    display = jest.fn()
    translate.mockImplementation(() => new Promise(resolve => {
      resolve('result')
      translated = Promise.resolve()
    }))
  })

  afterEach(() => {
    translate.clear()
  })

  it('should not display', () => {
    plugin.fn({ display, term: 'will not display' })

    expect(display.mock.calls.length).toBe(0)
  })

  it('should display default title when there is no query', () => {
    plugin.fn({ display, term: 'translate' })
    plugin.fn({ display, term: 'translate ' })

    expect(display).toBeCalled()
    expect(display).toBeCalledWith({ icon, title: NAME })
    expect(display).lastCalledWith({ icon, title: NAME })
  })

  it('should display loading and the result with no parameters', async () => {
    plugin.fn({ display, term: 'translate query' })

    await translated

    expect(display).toBeCalled()
    expect(display).toBeCalledWith({
      icon,
      id: ID,
      title: 'Loading...',
    })
    expect(display).lastCalledWith({
      icon,
      id: ID,
      title: 'result',
      subtitle: 'English',
    })

    expect(translate).toBeCalled()
    expect(translate).toBeCalledWith({
      query: 'query',
      source: 'auto',
      target: 'en',
    })
  })

  it('should display loading and the result with target', async () => {
    plugin.fn({ display, term: 'translate es pelota' })

    await translated

    expect(display).toBeCalled()
    expect(display).toBeCalledWith({
      icon,
      id: ID,
      title: 'Loading...',
    })
    expect(display).lastCalledWith({
      icon,
      id: ID,
      title: 'result',
      subtitle: 'Spanish',
    })

    expect(translate).toBeCalled()
    expect(translate).lastCalledWith({
      query: 'pelota',
      source: 'auto',
      target: 'es',
    })
  })

  it('should display loading and the result with source and target', async () => {
    plugin.fn({ display, term: 'translate en pt query' })

    await translated

    expect(display).toBeCalled()
    expect(display).toBeCalledWith({
      icon,
      id: ID,
      title: 'Loading...',
    })
    expect(display).lastCalledWith({
      icon,
      id: ID,
      title: 'result',
      subtitle: 'Portuguese',
    })

    expect(translate).toBeCalled()
    expect(translate).lastCalledWith({
      query: 'query',
      source: 'en',
      target: 'pt',
    })
  })
})
