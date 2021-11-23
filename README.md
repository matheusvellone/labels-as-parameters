# Labels as parameters

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/matheusvellone/labels-as-parameters/actions/workflows/check-dist.yml/badge.svg"></a>
</p>

Use this action to use your Pull Request labels as parameters in you workflow.

## Usage

```yml
jobs:
  deploy:
    name: Deploy Application
    runs-on: ubuntu-latest

    steps:
      - name: Extract labels
        uses: matheusvellone/labels-as-parameters@1.0.0
        id: parameters
        with:
          separator: "=" # Optional
          requiredParameters: environment, project # Optional
      - name: Deploy API
        if: ${{ contains(steps.parameters.outputs.project, 'api') }} # Be careful with this! Read below
        run: |
          ./deploy-api.sh --environment ${{ steps.parameters.outputs.environment }}
      - name: Deploy Internal API
        if: ${{ contains(steps.parameters.outputs.project, 'internal-api') }}
        run: |
          ./deploy-api-internal.sh --environment ${{ steps.parameters.outputs.environment }}
```

You can also add multiple labels to the Pull Request, and both `contains` would evaluate to `true` if the Pull Request had both labels.
Just be careful when using `contains` like in the example, because if a Pull Request had **only** one `project:*api*`-like label (like `project:internal-api`), the "Deploy API" would also be triggered.

## Inputs
The action takes two optional inputs: separator and requiredParameters.

### separator
The separator to be used to separate the key name from the value like.
Default value is `:`.

A label `environment:production` would generate the `environment` production with the `production` value.
### requiredParameters
A list required parameters, separated by `,`. If any of the required parameters is not found, the action will fail.
Default value is an empty list.

## Limitations
Currently, the project cannot execute the action after the merge on a branch (`push` event on a workflow) if the Pull Request the merge strategy is `rebase` or if the message of the commit does not contain the Pull Request number.

This is because the action will not be able to retrieve Pull Request labels.

A default message for merge, or squash, action on a Pull Request should work fine.

## TODOs
### Project
- Fix "Check dist" workflow
- Add test badge
- Add coverage (+ badge)

### Features
- Parse keys with "separator" in the key
- Parse values with "separator" in the value
- Parse multiple labels from the same parameter and output them as an array
- Parse multiple parameters and specify the output format: number, boolean, string. In a case where a single label is used and the output type is specified.
