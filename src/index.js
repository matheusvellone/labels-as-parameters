module.exports = ({
  parameters = [],
  separator = '='
}, context) => {
  const requiredParameters = parameters
    .map(parameter => parameter.trim())
    .filter(parameter => parameter)

  if (requiredParameters.length === 0) {
    throw new Error("Missing input 'parameters'")
  }

  const labels = context.payload.pull_request.labels.map(label => label.name)
  const repeatedParameters = []

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

  if (repeatedParameters.length > 0) {
    throw new Error(`Repeated parameters: ${repeatedParameters.join(', ')}`)
  }

  const missingParameters = requiredParameters.filter(parameter => !labelPairs[parameter])
  if (missingParameters.length > 0) {
    throw new Error(`Missing parameters: ${missingParameters.join(', ')}`)
  }

  return labelPairs
}
