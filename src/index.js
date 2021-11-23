const parseInputs = (inputs) => {
  const requiredParameters = inputs.requiredParameters.split(',')
    .map(parameter => parameter.trim())
    .filter(parameter => parameter)

  return {
    separator: inputs.separator,
    requiredParameters,
  }
}

const getLabels = async (client, context) => {
  if (context.payload.pull_request) {
    return context.payload.pull_request.labels
  }

  if (context.payload.head_commit) {
    const [, pullRequest] = context.payload.head_commit.message.match(/#(\d+)/)

    if (!pullRequest) {
      throw new Error('Could not find Pull Request number in commit message')
    }

    const { data } = await client.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: Number(pullRequest),
    })

    return data.labels
  }

  throw new Error('Could not find labels')
}

module.exports = async (rawInput, context, {
  client,
}) => {
  const {
    requiredParameters,
    separator,
  } = parseInputs(rawInput)

  const labels = (await getLabels(client, context)).map(label => label.name)

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
