export const createElement = ({ tag, props, text, eventHandlers = {} }) => {
  const attributes = props || [];
  const svgElements = ['svg', 'path'];
  let el = document.createElement(tag);

  if (svgElements.includes(tag)) {
    el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  }

  if (text) {
    el.innerText = text;
  }

  // Set element attributes
  Object.entries(attributes).forEach(([attribute, value]) => {
    el.setAttribute(attribute, value);
  });

  // Bind event listeners
  Object.entries(eventHandlers).forEach(([eventName, eventHandler]) => {
    el.addEventListener(eventName, eventHandler);
  });

  return el;
};

export const nestDomElements = (parentElement, childElement) => {
  parentElement.appendChild(childElement);
  return parentElement;
};

const generateChipComponent = ({ label, selector, deleteChip }) => {
  const chipElement = createElement({
    tag: 'div',
    props: { class: 'chip', 'data-element-selector': selector },
  });
  const chipLabelElement = createElement({
    tag: 'span',
    text: label,
    props: { class: 'chip__label' },
  });
  const svgElement = createElement({
    tag: 'svg',
    props: {
      class: 'chip__action-icon',
      viewBox: '0 0 24 24',
      'aria-hidden': 'true',
    },
    eventHandlers: { click: () => deleteChip(label) },
  });
  const svgPathElement = createElement({
    tag: 'path',
    props: {
      d:
        'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
    },
  });

  const svgNode = nestDomElements(svgElement, svgPathElement);
  const chipNode = nestDomElements(chipElement, chipLabelElement);

  return nestDomElements(chipNode, svgNode);
};

export default generateChipComponent;
