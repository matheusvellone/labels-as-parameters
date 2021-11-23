const extractLabels = require('../src/extractLabels')

describe('Extract Labels', () => {
  describe('with pull request event', () => {
    it('with two different labels', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [
              {
                name: 'foo:bar',
              },
              {
                name: 'baz:qux',
              },
            ],
          },
        },
      }

      const labels = await extractLabels(inputs, context, {})

      expect(labels).toEqual({
        foo: 'bar',
        baz: 'qux',
      })
    })

    it('without labels', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [],
          },
        },
      }

      const labels = await extractLabels(inputs, context, {})

      expect(labels).toEqual({})
    })

    it('with repeated labels', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [
              {
                name: 'foo:1',
              },
              {
                name: 'foo:2',
              },
            ],
          },
        },
      }

      const labels = await extractLabels(inputs, context, {})

      expect(labels).toEqual({
        foo: ['1', '2'],
      })
    })

    it('with no separator label', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [
              {
                name: 'foo',
              },
            ],
          },
        },
      }

      const labels = await extractLabels(inputs, context, {})

      expect(labels).toEqual({})
    })

    it('with custom separator', async () => {
      const inputs = {
        separator: '#',
        requiredParameters: '',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [
              {
                name: 'foo#bar',
              },
            ],
          },
        },
      }

      const labels = await extractLabels(inputs, context, {})

      expect(labels).toEqual({
        foo: 'bar',
      })
    })
  })

  describe('with push event', () => {
    it('with valid commit message and PR with labels', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          head_commit: {
            message: 'Merge commit #23'
          },
        },
        repo: {
          owner: 'matheusvellone',
          repo: 'labels-as-parameters',
        }
      }

      const getPullMock = jest.fn().mockResolvedValue({
        data: {
          labels: [
            {
              name: 'foo:bar',
            },
          ],
        },
      })
      const client = {
        pulls: {
          get: getPullMock,
        },
      }

      const labels = await extractLabels(inputs, context, { client })

      expect(labels).toEqual({
        foo: 'bar',
      })
      expect(getPullMock).toHaveBeenCalledWith({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: 23,
      })
    })

    it('with valid commit message and two IDs in message', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          head_commit: {
            message: 'Merge commit #27 but someone added #99 in the message'
          },
        },
        repo: {
          owner: 'matheusvellone',
          repo: 'labels-as-parameters',
        }
      }

      const getPullMock = jest.fn().mockResolvedValue({
        data: {
          labels: [
            {
              name: 'foo:bar',
            },
          ],
        },
      })
      const client = {
        pulls: {
          get: getPullMock,
        },
      }

      const labels = await extractLabels(inputs, context, { client })

      expect(labels).toEqual({
        foo: 'bar',
      })
      expect(getPullMock).toHaveBeenCalledWith({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: 27,
      })
    })

    it('with invalid commit message', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          head_commit: {
            message: 'Merge commit without Pull Request ID'
          },
        },
        repo: {
          owner: 'matheusvellone',
          repo: 'labels-as-parameters',
        }
      }

      const expectedError = new Error('Could not find Pull Request number in commit message')
      await expect(extractLabels(inputs, context, {})).rejects.toEqual(expectedError)
    })

    it('with invalid response from github', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '',
      }
      const context = {
        payload: {
          head_commit: {
            message: 'Merge commit #23'
          },
        },
        repo: {
          owner: 'matheusvellone',
          repo: 'labels-as-parameters',
        }
      }
      const expectedError = new Error('Some GitHub error')
      const client = {
        pulls: {
          get: jest.fn().mockRejectedValue(expectedError),
        },
      }

      await expect(extractLabels(inputs, context, { client })).rejects.toEqual(expectedError)
    })
  })

  describe('with requiredParameters', () => {
    it('normal use case', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: 'foo,project,name',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [
              {
                name: 'foo:1',
              },
              {
                name: 'foo:2',
              },
            ],
          },
        },
      }

      const expectedError = new Error('Missing parameters: project, name')
      await expect(extractLabels(inputs, context, {})).rejects.toEqual(expectedError)
    })

    it('with space to trim', async () => {
      const inputs = {
        separator: ':',
        requiredParameters: '  name    ',
      }
      const context = {
        payload: {
          pull_request: {
            labels: [
              {
                name: 'foo:1',
              },
              {
                name: 'foo:2',
              },
            ],
          },
        },
      }

      const expectedError = new Error('Missing parameters: name')
      await expect(extractLabels(inputs, context, {})).rejects.toEqual(expectedError)
    })
  })

  it('with unknown event', async () => {
    const inputs = {
      separator: ':',
      requiredParameters: 'name',
    }
    const context = {
      payload: {},
    }

    const expectedError = new Error('Could not find labels')
    await expect(extractLabels(inputs, context, {})).rejects.toEqual(expectedError)
  })
})
