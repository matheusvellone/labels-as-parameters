const { Toolkit } = require('actions-toolkit')
const path = require('path')
const runAction = require('../src')

const setEnv = (env) => {
  Object.assign(process.env, env)
}

const clearEnv = () => {
  process.env = {}
}

describe('Action', () => {
  afterEach(clearEnv)

  it('runs with an error', async () => {
    const fakeTools = new Toolkit()

    fakeTools.exit.failure = jest.fn()
    await runAction(fakeTools)

    expect(fakeTools.exit.failure).toHaveBeenCalled()
  })

  it('runs successfully', async () => {
    const eventName = 'pull_requests'
    setEnv({
      GITHUB_EVENT_PATH: path.join(__dirname, './fixtures/pull_request.json'),
      GITHUB_EVENT_NAME: eventName,
      INPUT_SEPARATOR: ':',
    })

    const fakeTools = new Toolkit({
      event: eventName,
    })

    fakeTools.exit.success = jest.fn()
    await runAction(fakeTools)

    expect(fakeTools.exit.success).toHaveBeenCalled()
    expect(fakeTools.exit.success).toHaveBeenCalledWith('Action complete')

    expect(fakeTools.outputs).toHaveProperty('environment', 'production')
    expect(fakeTools.outputs).toHaveProperty('owner', 'matheusvellone')
  })

  it('runs with an error', async () => {
    const eventName = 'pull_requests'
    setEnv({
      GITHUB_EVENT_NAME: eventName,
    })

    const fakeTools = new Toolkit({
      event: eventName,
    })

    fakeTools.exit.failure = jest.fn()
    await runAction(fakeTools)

    expect(fakeTools.exit.failure).toHaveBeenCalled()
    expect(fakeTools.exit.failure).toHaveBeenCalledWith('Could not find labels')
  })
})
