const parseInputs = (inputs) => {
  const requiredParameters = inputs.requiredParameters.split(',')
    .map(parameter => parameter.trim())
    .filter(parameter => parameter)

  return {
    separator: inputs.separator,
    requiredParameters,
  }
}

module.exports = (rawInput, context) => {
  const {
    requiredParameters,
    separator,
  } = parseInputs(rawInput)

  const labels = context.payload.pull_request.labels.map(label => label.name)

  const labelPairs = labels
    .reduce((acc, label) => {
      const [key, value] = label.split(separator)

      if (!value) {
        return acc
      }

      if (acc[key]) {
        acc[key] = [
          acc[key],
          value,
        ]
      } else {
        acc[key] = value
      }

      return acc
    }, {})

  if (requiredParameters.length) {
    const requiredParametersList = requiredParameters
      .map(parameter => parameter.trim())
      .filter(parameter => parameter)

    const missingParameters = requiredParametersList.filter(parameter => !labelPairs[parameter])
    if (missingParameters.length > 0) {
      throw new Error(`Missing parameters: ${missingParameters.join(', ')}`)
    }
  }

  return labelPairs
}
