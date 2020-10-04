const getFirstOfType = (selector) => document.querySelector(selector);

class Controller {
  _defaultOrganizationURL = 'https://example.atlassian.net';
  _defaultPrefixes = ['A', 'BUNCH', 'OF', 'SAMPLE', 'TICKET', 'PREFIXES'];
  organizationURL = '';
  ticketPrefixes = [];

  constructor(config) {
    this.config = config;
  }

  get branchNameContainer() {
    return getFirstOfType(this.config.GITHUB_SELECTORS.BRANCH_NAME_CONTAINER);
  }

  get prMetaContainer() {
    return getFirstOfType(this.config.GITHUB_SELECTORS.PR_METADATA_CONTAINER);
  }

  get injectedNodeContainer() {
    return getFirstOfType(this.config.APP_SELECTORS.INJECTED_NODE_CONTAINER);
  }

  get ticketID() {
    const branchName = this.branchNameContainer.innerText || '';
    const ticketIDRegex = this.generateTicketIDRegex();
    const match = branchName.match(ticketIDRegex) || [];
    return (match[0] || '').toUpperCase();
  }

  async fetchUserConfigFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ['organizationURL', 'ticketPrefixes'],
        ({ ticketPrefixes, organizationURL }) => {
          this.organizationURL =
            organizationURL || this._defaultOrganizationURL;
          this.ticketPrefixes = ticketPrefixes || this._defaultPrefixes;
          resolve();
        },
      );
    });
  }

  generateTicketIDRegex() {
    const targetPrefixes = this.ticketPrefixes.join('|');
    return new RegExp(`(${targetPrefixes})-([10-9]+)`, 'i');
  }

  generateAnchorElement() {
    const linkNode = document.createElement('a');
    const ticketURL = `${this.organizationURL}/browse/${this.ticketID}`;

    linkNode.title = ticketURL;
    linkNode.href = ticketURL;
    linkNode.id = `${this.organizationURL}-TICKET-${this.ticketID}`;
    linkNode.classList = this.config.GITHUB_CLASSNAMES.LINK;
    linkNode.textContent = `JIRA-TICKET: ${this.ticketID}`;
    linkNode.target = '_blank';

    return linkNode;
  }

  generateLinkContainer() {
    const container = document.createElement('span');

    container.classList = this.config.GITHUB_CLASSNAMES.SPAN;
    return container;
  }

  generateMainContainer() {
    const mainContainer = document.createElement('span');
    mainContainer.classList = this.config.APP_CLASSNAMES.INJECTED_NODE_CONTAINER;
    mainContainer.textContent = '- Resolves ';
    return mainContainer;
  }

  async exec() {
    await this.fetchUserConfigFromStorage();

    if (this.injectedNodeContainer) return; // abort when node to inject already exists
    if (!(this.prMetaContainer && this.branchNameContainer)) return; // abort when no meta data container
    if (!this.ticketID) return; // abort when no ticketID is matched

    const link = this.generateAnchorElement();
    const linkContainer = this.generateLinkContainer();
    const nodeToInject = this.generateMainContainer();

    linkContainer.appendChild(link);
    nodeToInject.appendChild(linkContainer);
    this.prMetaContainer.appendChild(nodeToInject);
  }
}

const configUrl = chrome.runtime.getURL('config/index.js');
import(configUrl).then((config) => {
  const controller = new Controller(config);
  controller.exec();
  chrome.runtime.onMessage.addListener((request) => {
    if (request.message === 'history_state_updated') {
      controller.exec();
    }
  });
});
