class Store {
  _defaultorganizationURL = 'https://example.atlassian.net';
  _defaultPrefixes = ['A', 'BUNCH', 'OF', 'SAMPLE', 'TICKET', 'PREFIXES'];
  _organizationURL = '';
  _ticketPrefixes = [];
  _formState = {
    ticketPrefix: {
      error: null,
      value: '',
    },
    organizationURL: {
      error: null,
      value: '',
    },
  };

  get actions() {
    // public way of accessing store methods
    return {
      setorganizationURL: this._setorganizationURL.bind(this),
      addTicketPrefix: this._addTicketPrefix.bind(this),
      removeTicketPrefix: this._removeTicketPrefix.bind(this),
      hasTicketPrefix: this._hasTicketPrefix.bind(this),
    };
  }

  get data() {
    // public way of accessing store data
    return {
      organizationURL: this._organizationURL,
      ticketPrefixes: this._ticketPrefixes,
      formState: this._formState,
    };
  }

  async initialize() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ['organizationURL', 'ticketPrefixes'],
        ({ organizationURL, ticketPrefixes }) => {
          this._organizationURL =
            organizationURL || this._defaultorganizationURL;
          this._ticketPrefixes = ticketPrefixes || this._defaultPrefixes;
          resolve();
        },
      );
    });
  }

  _setorganizationURL(value) {
    const normalizedValue = (value || '').toLowerCase();
    this._organizationURL = normalizedValue;
    this._commitUpdates();
  }

  _addTicketPrefix(prefix) {
    const ticketPrefixes = [...this._ticketPrefixes];
    ticketPrefixes.unshift(prefix);
    this._ticketPrefixes = ticketPrefixes;
    this._commitUpdates();
  }

  _removeTicketPrefix(prefix) {
    const filteredTicketPrefixes = this._ticketPrefixes.filter(
      (ticketPrefix) => ticketPrefix !== prefix,
    );
    this._ticketPrefixes = filteredTicketPrefixes;
    this._commitUpdates();
  }

  _hasTicketPrefix(prefix) {
    return this._ticketPrefixes.includes(prefix);
  }

  _commitUpdates() {
    chrome.storage.local.set({
      organizationURL: this._organizationURL,
      ticketPrefixes: this._ticketPrefixes,
    });
  }
}

export default Store;
