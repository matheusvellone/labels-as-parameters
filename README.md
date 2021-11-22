# Labels as parameters

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
    - name: Deploy
      run: |
        ./deploy.sh \
          --environment ${{ steps.parameters.outputs.environment }} \
          --assignee ${{ steps.parameters.outputs.assignee[0] }} \
          --assignee ${{ steps.parameters.outputs.assignee[1] }}
```

## TODOs
- Parse keys with "separator" in the key
- Parse values with "separator" in the value
- Parse multiple labels from the same parameter and output them as an array
- Parse multiple parameters and specify the output format: number, boolean, string. In a case where a single label is used and the output type is specified.
