# Github to Jira

A simple Chrome extension that allows you to go from a Github pull request to the corresponding Jira ticket in a click

**NOTE: Only Useful for cases where branch names are created using ticket number**

#### How it works

- Given that you have a Jira ticket with number **POC-042**, and your branch name is a derivative of that Jira ticket number. e.g **POC-042**, or **POC-042-implement-proof-of-concept**, **proof-of-concept-POC-042**
- The extension parses your branch name and checks if it matches any of the prefixes you have configured via the popup
- If branch name matches any of the target prefixes, it extracts the ticket number and then generates a link to the appropriate Jira ticket
- Finally, it embeds this link on the pull request page as shown in the image below so you can easily navigate to the relevant Jira ticket

![Demo Image](https://firebasestorage.googleapis.com/v0/b/mfalade-80807.appspot.com/o/github-jira-linker%2Fimage.png?alt=media&token=df61bf03-a59e-49a3-9651-d0888af15ff6)
