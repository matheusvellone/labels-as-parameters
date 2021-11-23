module.exports = ({
  requiredParameters,
  separator,
}, context) => {
  if (requiredParameters && typeof requiredParameters !== 'array') {
    throw new Error('requiredParameters must be an array')
  }

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
    const requiredParametersList = parameters
      .map(parameter => parameter.trim())
      .filter(parameter => parameter)

    const missingParameters = requiredParametersList.filter(parameter => !labelPairs[parameter])
    if (missingParameters.length > 0) {
      throw new Error(`Missing parameters: ${missingParameters.join(', ')}`)
    }
  }

  return labelPairs
}
