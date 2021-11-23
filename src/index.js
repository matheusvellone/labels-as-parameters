const runAction = require('./extractLabels')

module.exports = async (tools) => {
  try {
    const labelPairs = await runAction(tools.inputs, tools.context, {
      client: tools.github,
    })

    Object.keys(labelPairs).forEach((label) => {
      tools.outputs[label] = labelPairs[label]
    })

    tools.exit.success('Action complete')
  } catch (error) {
    tools.exit.failure(error.message)
  }
}
