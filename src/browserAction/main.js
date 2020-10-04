import generateChipComponent from './lib/chipGenerator.js';
import utils from './lib/utils.js';
import AppStore from './lib/store.js';

const {
  cleanupTicketPrefix,
  cleanUpOrganizationURL,
  findElement,
  createSelector,
} = utils;
const NOTIFICATION = {
  SUCCESS: 'notification--success',
  ERROR: 'notification--error',
};

class BrowserAction {
  store = null;
  organizationURLForm = findElement('organization-url-form');
  organizationURLInput = findElement('organization-url-input');
  organizationURLNotification = findElement('organization-url-notification');
  ticketPrefixForm = findElement('ticket-prefix-form');
  ticketPrefixInput = findElement('ticket-prefix-input');
  ticketPrefixNotification = findElement('ticket-prefix-notification');
  chipsContainer = findElement('chips-container');
  appContexts = ['ticketPrefix', 'organizationURL'];

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    this.store = new AppStore();
    await this.store.initialize();
    this.attachFormListeners();
    this.renderTicketPrefixes();
    this.renderorganizationURL();
  }

  attachFormListeners() {
    this.organizationURLForm.addEventListener('submit', (event) => {
      const context = 'organizationURL';
      event.preventDefault();
      const rawValue = this.organizationURLInput.value;
      const cleanedValue = cleanUpOrganizationURL(rawValue);
      const { isValid, errorMessage } = this.validateFormInput(
        context,
        cleanedValue,
      );

      if (!isValid) return this.renderErrorMessage(context, errorMessage);

      this.store.actions.setorganizationURL(cleanedValue);
      this.renderSuccessMessage(context);
    });

    this.ticketPrefixForm.addEventListener('submit', (event) => {
      const context = 'ticketPrefix';
      event.preventDefault();
      const rawTicketPrefix = this.ticketPrefixInput.value;
      const cleanTicketPrefix = cleanupTicketPrefix(rawTicketPrefix);
      const { isValid, errorMessage } = this.validateFormInput(
        context,
        cleanTicketPrefix,
      );

      if (!isValid) return this.renderErrorMessage(context, errorMessage);

      this.store.actions.addTicketPrefix(cleanTicketPrefix);
      this.renderTicketPrefixes();
      this.ticketPrefixInput.value = '';
    });

    this.appContexts.forEach((context) => {
      const inputElement = this[`${context}Input`];
      const notificationElement = this[`${context}Notification`];
      inputElement.addEventListener('input', () => {
        if (
          inputElement.classList.contains('error') ||
          inputElement.classList.contains('success')
        ) {
          inputElement.classList.remove('error');
          inputElement.classList.remove('success');
          notificationElement.classList.remove(NOTIFICATION.SUCCESS);
          notificationElement.classList.remove(NOTIFICATION.ERROR);
        }
      });
    });
  }

  renderTicketPrefixes() {
    const ticketPrefixes = this.store.data.ticketPrefixes;
    this.chipsContainer.textContent = '';
    ticketPrefixes.forEach((prefix) => {
      const chipComponent = generateChipComponent({
        label: prefix,
        selector: createSelector(prefix),
        deleteChip: this.deleteChip.bind(this),
      });
      this.chipsContainer.appendChild(chipComponent);
    });
  }

  renderorganizationURL() {
    const organizationURL = this.store.data.organizationURL;
    this.organizationURLInput.value = organizationURL;
  }

  renderErrorMessage(context, errorMessage) {
    if (!this.appContexts.includes(context)) return;

    this[`${context}Input`].classList.add('error');
    this[`${context}Notification`].innerHTML = errorMessage;
    this[`${context}Notification`].classList.remove(NOTIFICATION.SUCCESS);
    this[`${context}Notification`].classList.add(NOTIFICATION.ERROR);
  }

  renderSuccessMessage(context) {
    if (!this.appContexts.includes(context)) return;

    this[`${context}Input`].classList.add('success');
    this[`${context}Notification`].innerHTML = 'Saved!';
    this[`${context}Notification`].classList.remove(NOTIFICATION.ERROR);
    this[`${context}Notification`].classList.add(NOTIFICATION.SUCCESS);
  }

  validateFormInput(context, value) {
    const formState = this.store.data.formState;
    const validators = {
      ticketPrefix: this.validateTicketPrefix.bind(this),
      organizationURL: this.validateorganizationURL.bind(this),
    };
    const validateFunc = validators[context];
    const error = validateFunc.call(null, value);

    formState[context].error = error;
    return { isValid: !Boolean(error), errorMessage: error };
  }

  validateTicketPrefix(prefix) {
    if (!prefix) {
      return 'AlphaNumeric value expected.';
    }
    if (this.store.actions.hasTicketPrefix(prefix)) {
      return `${prefix} already exists.`;
    }
    return null;
  }

  validateorganizationURL(value) {
    const trimmedValue = (value || '').trim();
    if (!trimmedValue) {
      return 'Please provide a value.';
    }
    if (!value.endsWith('.atlassian.net')) {
      return 'Please provide a correct Atlassian url.';
    }
    return null;
  }

  deleteChip(prefix) {
    this.store.actions.removeTicketPrefix(prefix);
    const chip = findElement(createSelector(prefix));
    chip.parentNode.removeChild(chip);
  }
}

export default { initialize: () => new BrowserAction() };
