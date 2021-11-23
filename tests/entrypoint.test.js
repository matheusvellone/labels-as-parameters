const { Toolkit } = require('actions-toolkit')
const action = require('../src/index')

describe('Entrypoint', () => {
  it('Should call Toolkit.run', () => {
    const spy = Toolkit.run = jest.fn()

    require('../src/bin/run')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(action)
  })
})
