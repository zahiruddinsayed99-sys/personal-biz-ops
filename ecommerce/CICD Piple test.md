This is the perfect time to review the CI/CD pipeline while Jules handles the backend routing bugs.

Because OPS-001 is an infrastructure task, you won't test it by clicking around your localhost application. Instead, you will verify it directly on GitHub.

Here is exactly how to check the code changes and test the automated pipeline.

### 1. How to Check the Code Changes

You can see exactly what Jules did by going to the **Pull Requests** tab in your GitHub repository, finding the closed/merged PR for **#40**, and clicking the **Files changed** tab.

You should expect to see only two main changes:

* **The Workflow File:** A new `.yml` file created inside the `.github/workflows/` directory (e.g., `ci.yml` or `build.yml`). This file contains the instructions for GitHub servers to check out your code, install dependencies, run the linter, and run the tests.
* **The README.md:** A small markdown addition at the very top of your `README.md` file injecting an image tag like `[![CI Build](https://github.com/.../badge.svg)]`.

### 2. How to Test the CI/CD Workflow

To verify the pipeline is actually working and catching errors, you need to watch it run on GitHub's servers.

**Step A: Check the History**

1. Go to your repository on GitHub.
2. Click on the **Actions** tab at the top.
3. On the left sidebar, click on the name of the new workflow (e.g., "CI/CD Pipeline" or "Build & Lint").
4. You will see a list of recent runs. If the merge was successful, you should see a green checkmark `✅` next to the latest run. Click on it to see the exact steps GitHub executed (installing Angular, running PyTest, etc.).

**Step B: The Live "Break" Test (Optional but Recommended)**
The true test of a CI pipeline is seeing it successfully *block* bad code. You can test this on a temporary branch:

1. In your local terminal, create a test branch: `git checkout -b test-ci-pipeline`
2. Open a Python file and introduce a deliberate syntax error (e.g., type `this is broken python` on line 1).
3. Commit and push the broken code: `git commit -am "test: purposely breaking code" && git push origin test-ci-pipeline`
4. Open a Draft Pull Request on GitHub for this branch.
5. Watch the PR page. Within a minute, the GitHub Action will spin up, try to build the code, fail on your syntax error, and mark the PR with a red `❌`, preventing it from being merged.
6. (Remember to close the PR and delete the branch afterward!)

### 3. How to Verify the Status Badge

Go to the main page of your repository on GitHub (the `Code` tab).
Look at the top of your `README.md` file. You should see a small badge that says **"Build: Passing"** (or something similar) in bright green.

If you do the "Live Break Test" above and merge a broken build to your main branch, that badge will automatically flip to a red **"Failing"**, instantly notifying anyone visiting your portfolio that the codebase needs attention.
