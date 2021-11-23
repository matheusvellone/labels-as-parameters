const { Toolkit } = require('actions-toolkit')
const runAction = require('./src')

Toolkit.run(async (tools) => {
  try {
    const labelPairs = await runAction(tools.inputs, tools.context, {
      client: tools.github,
    })

    // Can't this be a simple assignment?
    Object.keys(labelPairs).forEach((label) => {
      tools.outputs[label] = labelPairs[label]
    })

    tools.exit.success('Action complete')
  } catch (error) {
    tools.exit.failure(error.message)
  }
})
