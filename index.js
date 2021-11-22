const { Toolkit } = require('actions-toolkit')
const runAction = require('./src')

Toolkit.run((tools) => {
  try {
    const labelPairs = runAction(tools.inputs, tools.context)

    // Can't this be a simple assignment?
    Object.keys(labelPairs).forEach((label) => {
      tools.outputs[label] = labelPairs[label]
    })

    tools.exit.success('Action complete')
  } catch (error) {
    console.error(error)
    tools.exit.failure(error.message)
  }
})
