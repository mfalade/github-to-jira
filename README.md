# Google Chrome Extension: Jira Ticket Link Generator

Derives and injects the link to the relevant Jira issues for your *pull requests*.

Works best for cases where branch names are derived from ticket ID

Customizable for other use cases as well 🚀.

#### Setup

To use the extension,

- Clone or download this repo
- Provide the relevant values for the contents of the `config/index.js` file.
You can 
- Launch your extensions manager [chrome://extensions/](chrome://extensions) in your (Google Chrome) browser
- Click on `Load unpacked` and select the jira-ticket-util folder (Ensure developer mode is enabled)
- Load the extension then navigate to any pull request on your orgainzation's repo
- You should find an additional link to the relevant issue on Jira

![Demo Image](https://firebasestorage.googleapis.com/v0/b/mfalade-80807.appspot.com/o/github-jira-linker%2Fimage.png?alt=media&token=df61bf03-a59e-49a3-9651-d0888af15ff6)
