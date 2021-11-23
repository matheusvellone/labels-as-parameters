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
        requiredParameters: environment, owner # Optional
    - name: Deploy
      run: >-
        ./deploy.sh --environment ${{ steps.parameters.outputs.environment }} --assignee ${{ steps.parameters.outputs.assignee[0] }} --assignee ${{ steps.parameters.outputs.assignee[1] }}
```

## Inputs
The action takes two optional inputs: separator and requiredParameters.

### separator
The separator to be used to separate the key name from the value like.
Default value is `:`.

A label `environment:production` would generate the `environment` production with the `production` value.
### requiredParameters
A list required parameters, separated by `,`. If any of the required parameters is not found, the action will fail.
Default value is an empty list.

## TODOs
### Project
- Fix "Check dist" badge

### Features
- Parse keys with "separator" in the key
- Parse values with "separator" in the value
- Parse multiple labels from the same parameter and output them as an array
- Parse multiple parameters and specify the output format: number, boolean, string. In a case where a single label is used and the output type is specified.
