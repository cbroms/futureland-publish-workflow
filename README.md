# Futureland Publish Workflow

This action will publish to [Futureland](https://futureland.tv) when you push new commits. I'm playing around with the best way to make this work; don't use this action right now. It's hacked together and probably won't work.

It requires your repository have a couple of [secret keys](https://docs.github.com/en/actions/reference/encrypted-secrets), `FL_JOURNAL` and `FL_TOKEN`: the name of the journal you want to publish updates to and a JWT for your account, respectively.

Then, you can use the action in a [Github Actions Workflow](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions):

```yml
on: [push]

jobs:
  publish-to-fl-job:
    runs-on: ubuntu-latest
    name: A job to publish the latest commit message to Futureland
    steps:
      - name: Publish to Futureland
        id: fl-publish
        uses: cbroms/futureland-publish-workflow@v0.0.2
        with:
          publish-to: ${{ secrets.FL_JOURNAL }}
          publish-message: ⬆️ Pushed commit ["${{ github.event.head_commit.message }}"](${{ github.event.head_commit.url }})
          fl-credential: ${{ secrets.FL_TOKEN }}
```

See `index.js` for the implementation, and `action.yml` for details about each of the action's fields (they're pretty self explanatory).

## TODO, ideas

- Get additional information about a commit, like # of lines, # of additions/deletions, etc. Might want to move the message part into the implementation and provide some metrics that can be included. This would mean you would pass the commit info from `${{ github.event.head_commit }}` as a parameter to the action, rather than a preformatted string.
- Maybe use FL templates? I can see them when getting the journal info. Could be nice to use them.
- Restrict publishing to commits by a certain author, not collaborators.
- Publish commits to the author's account, should work for multiple collaborators (e.g. cbroms -> @christian, tlz9472 -> @sydney)
- Also handle PRs, merges, etc.
